// لیست سوالات (در اینجا فقط ID و متن و گزینه و جواب صحیح هست)
const questions = [
  { id: "q1", text: "1. 'سلام' به اسپانیایی چی میشه؟", options: ["Hola", "Adiós"], correct: 0 },
  { id: "q2", text: "2. 'صبح بخیر' به اسپانیایی چی میشه؟", options: ["Buenas noches", "Buenos días"], correct: 1 },
  { id: "q3", text: "3. معنی کلمه 'Gracias' چیه؟", options: ["ممنون", "ببخشید"], correct: 0 },
  { id: "q4", text: "4. چطور می‌گوییم 'اسم من... است'؟", options: ["Me llamo...", "Tengo..."], correct: 0 }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

    // ۱. شروع تست
    if (update.message?.text === "/start") {
      await sendBotMessage(BOT_TOKEN, update.message.chat.id, "برای شروع تست بزن:", {
        inline_keyboard: [[{ text: "📝 شروع", callback_data: "q1_0" }]]
      });
    }

    // ۲. مدیریت کلیک روی دکمه‌ها
    if (update.callback_query) {
      const query = update.callback_query;
      const [qid, score] = query.data.split("_"); // مثلا q2_1

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: query.id })
      });

      // اگر کاربر غلط زد
      if (qid === "wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ اشتباه بود!", show_alert: true })
        });
        return new Response("OK");
      }

      // اگر تست تمام شد
      if (qid === "finish") {
        await sendBotMessage(BOT_TOKEN, query.message.chat.id, `🎉 تبریک! تست تمام شد.\nامتیاز نهایی: ${score} از ${questions.length}`);
        return new Response("OK");
      }

      // پیدا کردن سوال بعدی
      const currentQ = questions.find(q => q.id === qid);
      const currentIndex = questions.indexOf(currentQ);
      const nextIndex = currentIndex + 1;
      
      // تعیین دیتای دکمه بعدی (اگر سوال بعدی وجود داشت، آیدی سوال بعدی رو بفرست، وگرنه finish)
      const nextData = (nextIndex < questions.length) ? questions[nextIndex].id : "finish";

      // ارسال سوال جدید
      await sendBotMessage(BOT_TOKEN, query.message.chat.id, currentQ.text, {
        inline_keyboard: [
          [{ text: currentQ.options[0], callback_data: (currentQ.correct === 0 ? `${nextData}_${parseInt(score) + 1}` : "wrong") }],
          [{ text: currentQ.options[1], callback_data: (currentQ.correct === 1 ? `${nextData}_${parseInt(score) + 1}` : "wrong") }]
        ]
      });
    }
    return new Response("OK");
  }
};

async function sendBotMessage(token, chatId, text, reply_markup = null) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup })
  });
}
