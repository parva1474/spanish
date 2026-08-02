const easyQuestions = [
  { text: "۱. سلام به اسپانیایی؟", options: ["Hola", "Adiós"], correct: 0 },
  { text: "۲. صبح بخیر؟", options: ["Buenas noches", "Buenos días"], correct: 1 },
  { text: "۳. ممنون؟", options: ["Gracias", "De nada"], correct: 0 }
];

const hardQuestions = [
  { text: "۴. فعل بودن (ما هستیم)؟", options: ["Somos", "Sois"], correct: 0 },
  { text: "۵. معنی Ir؟", options: ["رفتن", "خوردن"], correct: 0 }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is active");

    try {
      const update = await request.json();
      const token = env.BOT_TOKEN;

      // ۱. هندل کردن دستور /start (شروع یا ادامه بازی)
      if (update.message?.text === "/start") {
        const userId = update.message.from.id;
        const chatId = update.message.chat.id;

        // دریافت وضعیت کاربر از دیتابیس D1
        let state = await getUserState(env.DB, userId);
        
        if (!state) {
          // اگر کاربر جدید است، وضعیت اولیه ثبت می‌شود
          state = { score: 0, level: "easy", question_index: 0 };
          await saveUserState(env.DB, userId, state);
        }

        await sendQuestion(token, chatId, state);
      }

      // ۲. هندل کردن کلیک روی دکمه‌ها
      if (update.callback_query) {
        const q = update.callback_query;
        const userId = q.from.id;
        const chatId = q.message.chat.id;
        const messageId = q.message.message_id;

        // دریافت وضعیت فعلی از دیتابیس
        let state = await getUserState(env.DB, userId);
        if (!state) state = { score: 0, level: "easy", question_index: 0 };

        const [action, clickedIndexStr] = q.data.split("_");
        const clickedIndex = parseInt(clickedIndexStr);

        // آنسر کردن کالبک برای بستن حالت لودینگ دکمه
        await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });

        // بررسی اینکه آیا کالبک مربوط به سوال فعلی است یا قدیمی
        if (clickedIndex !== state.question_index) {
          await telegramFetch(token, "editMessageText", {
            chat_id: chatId,
            message_id: messageId,
            text: "⚠️ این سوال قدیمی است یا قبلاً به آن پاسخ داده‌اید."
          });
          return new Response("OK");
        }

        const list = state.level === "hard" ? hardQuestions : easyQuestions;
        const currentQ = list[state.question_index];

        if (action === "correct") {
          state.score += 1;
          state.question_index += 1;

          // غیرفعال کردن دکمه‌های پیام قبلی و ثبت پاسخ صحیح
          await telegramFetch(token, "editMessageText", {
            chat_id: chatId,
            message_id: messageId,
            text: `${currentQ.text}\n\n✅ **پاسخ شما درست بود!**`
          });

          // ارتقا به سطح سخت در صورت اتمام سوالات آسان
          if (state.level === "easy" && state.question_index >= easyQuestions.length) {
            state.level = "hard";
            state.question_index = 0;
            await telegramFetch(token, "sendMessage", {
              chat_id: chatId,
              text: "🔥 **عالی بود! شما به سطح سخت ارتقا یافتید.**"
            });
          }

          // ذخیره وضعیت جدید در D1
          await saveUserState(env.DB, userId, state);

          // ارسال سوال بعدی یا اتمام بازی
          const currentList = state.level === "hard" ? hardQuestions : easyQuestions;
          if (state.question_index < currentList.length) {
            await sendQuestion(token, chatId, state);
          } else {
            await telegramFetch(token, "sendMessage", {
              chat_id: chatId,
              text: `🎉 **تبریک! شما تمام سوالات را تمام کردید.**\n🏆 امتیاز نهایی شما: ${state.score}`
            });
          }

        } else if (action === "wrong") {
          // کم کردن امتیاز (حداقل ۰)
          state.score = Math.max(0, state.score - 1);
          await saveUserState(env.DB, userId, state);

          // غیرفعال کردن دکمه‌های پیام قبلی
          await telegramFetch(token, "editMessageText", {
            chat_id: chatId,
            message_id: messageId,
            text: `${currentQ.text}\n\n❌ **پاسخ نادرست بود! (۱- امتیاز)**`
          });

          // ارسال مجدد همان سوال
          await sendQuestion(token, chatId, state);
        }
      }

    } catch (err) {
      console.error("Worker Error:", err);
    }

    return new Response("OK");
  }
};

// --- توابع کمکی ---

// ارسال سوال به همراه دکمه‌ها
async function sendQuestion(token, chatId, state) {
  const list = state.level === "hard" ? hardQuestions : easyQuestions;
  const q = list[state.question_index];

  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: `📊 **امتیاز:** ${state.score} | **سطح:** ${state.level}\n\n${q.text}`,
    reply_markup: {
      inline_keyboard: [
        q.options.map((opt, i) => ({
          text: opt,
          callback_data: i === q.correct ? `correct_${state.question_index}` : `wrong_${state.question_index}`
        }))
      ]
    }
  });
}

// تابع اختصاصی درخواست‌های تلگرام همراه با چک کردن خطا
async function telegramFetch(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  
  const data = await res.json();
  if (!data.ok) {
    console.error(`Telegram API Error (${method}):`, data);
  }
  return data;
}

// دریافت وضعیت کاربر از دیتابیس D1
async function getUserState(db, userId) {
  const stmt = db.prepare("SELECT score, level, question_index FROM user_state WHERE user_id = ?");
  const result = await stmt.bind(userId).first();
  return result || null;
}

// ذخیره یا آپدیت وضعیت کاربر در دیتابیس D1
async function saveUserState(db, userId, state) {
  const stmt = db.prepare(`
    INSERT INTO user_state (user_id, score, level, question_index)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      score = excluded.score,
      level = excluded.level,
      question_index = excluded.question_index
  `);
  await stmt.bind(userId, state.score, state.level, state.question_index).run();
                               }
