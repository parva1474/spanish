// src/index.js
import { lessons } from './lessons.js';

const CHANNEL_1 = "@nwechannell"; 
const CHANNEL_2 = "@parvapoem"; 
const ADMIN_ID = "109710949"; // آیدی عددی شما

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is active");
    
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      const db = env.DB;
      
      if (!token) return new Response("OK");

      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        
        // دستور ادمین برای تایید پرداخت
        if (text.startsWith("/approve ") && String(chatId) === ADMIN_ID) {
          const targetChatId = text.split(" ")[1];
          if (db) {
            await db.prepare("INSERT INTO users (chat_id, is_paid) VALUES (?, 1) ON CONFLICT(chat_id) DO UPDATE SET is_paid = 1").bind(targetChatId).run();
          }
          await telegramFetch(token, "sendMessage", { chat_id: chatId, text: `✅ دسترسی کاربر ${targetChatId} فعال شد.` });
          await telegramFetch(token, "sendMessage", { chat_id: targetChatId, text: `🎉 پرداخت شما تأیید شد! اکنون به درس‌های ۳ به بعد دسترسی دارید.` });
          return new Response("OK");
        }

        const isMember = await checkUserMembership(token, chatId);
        if (!isMember) return new Response("OK");

        if (text.startsWith("/start") || text === "🏠 منوی اصلی") {
          await handleStart(token, chatId, db);
        } else if (text === "🚀 ادامه یادگیری (پنل درس‌ها)") {
          await handleQuickMenu(token, chatId, db);
        } else if (text === "📚 فهرست کامل درس‌ها") {
          await showLessonList(token, chatId, 1);
        } else if (text === "❓ راهنما") {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: "راهنما: از کلیدهای پایین صفحه برای دسترسی سریع به پنل درس‌ها و فهرست استفاده کنید.",
            reply_markup: getPersistentKeyboard()
          });
        } else {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: "لطفاً از دکمه‌های پایین صفحه استفاده کنید.",
            reply_markup: getPersistentKeyboard()
          });
        }
      } else if (update.callback_query) {
        const q = update.callback_query;
        const chatId = q.message.chat.id;
        const data = q.data;
        
        if (data === "check_membership") {
          const isMember = await checkUserMembership(token, chatId);
          if (isMember) {
            await telegramFetch(token, "answerCallbackQuery", { 
              callback_query_id: q.id, 
              text: "عضویت شما تأیید شد! خوش آمدید 🎉",
              show_alert: true 
            });
            await handleStart(token, chatId, db);
          } else {
            await telegramFetch(token, "answerCallbackQuery", { 
              callback_query_id: q.id, 
              text: "شما هنوز در هر دو کانال عضو نشده‌اید!", 
              show_alert: true 
            });
          }
          return new Response("OK");
        }

        const isMember = await checkUserMembership(token, chatId);
        if (!isMember) return new Response("OK");

        if (data === "pay_info") {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: `💳 **راهنمای پرداخت اشتراک:**\n\n` +
                  `برای دسترسی به درس‌های ۳ به بعد، مبلغ موردنظر را به شماره کارت زیر واریز نمایید:\n\n` +
                  `📌 \`6037997545103955\`\n` +
                  `👤 **به نام:** بهروز\n\n` +
                  `📥 **ارسال فیش و فعال‌سازی:**\n` +
                  `پس از واریز، تصویر رسید را به همراه **آیدی عددی** خود به پشتیبانی (\`@parva1474\`) ارسال کنید.\n\n` +
                  `🔍 **چگونه آیدی عددی خود را پیدا کنیم؟**\n` +
                  `وارد ربات \`@userinfobot\` شوید، ربات به شما یک عدد چندرقمی می‌دهد؛ آن عدد را به همراه فیش واریزی برای پشتیبان بفرستید.`,
            parse_mode: "Markdown"
          });
          await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
          return new Response("OK");
        }

        // مدیریت صفحه‌بندی فهرست درس‌ها
        if (data.startsWith("lessons_page_")) {
          const page = parseInt(data.split("_")[2]);
          await editLessonList(token, chatId, q.message.message_id, page);
          await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
          return new Response("OK");
        }

        await handleCallback(token, q, db);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    
    return new Response("OK");
  }
};

function getPersistentKeyboard() {
  return {
    keyboard: [
      [{ text: "🚀 ادامه یادگیری (پنل درس‌ها)" }],
      [{ text: "📚 فهرست کامل درس‌ها" }, { text: "❓ راهنما" }]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

async function checkUserMembership(token, chatId) {
  try {
    const res1 = await telegramFetch(token, "getChatMember", { chat_id: CHANNEL_1, user_id: chatId });
    const res2 = await telegramFetch(token, "getChatMember", { chat_id: CHANNEL_2, user_id: chatId });

    const validStatuses = ["creator", "administrator", "member"];
    const status1 = res1 && res1.result ? res1.result.status : null;
    const status2 = res2 && res2.result ? res2.result.status : null;

    if (validStatuses.includes(status1) && validStatuses.includes(status2)) {
      return true;
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: "❌ برای استفاده از ربات، لطفاً ابتدا در **دو کانال زیر** عضو شوید:\n\n1️⃣ " + CHANNEL_1 + "\n2️⃣ " + CHANNEL_2,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 عضویت در کانال اول", url: `https://t.me/${CHANNEL_1.replace('@', '')}` }],
          [{ text: "📢 عضویت در کانال دوم", url: `https://t.me/${CHANNEL_2.replace('@', '')}` }],
          [{ text: "✅ عضو شدم، بررسی کن", callback_data: "check_membership" }]
        ]
      }
    });

    return false;
  } catch (e) {
    return true; 
  }
}

async function handleStart(token, chatId, db) {
  let progress = 0;
  if (db) {
    try {
      const { results } = await db.prepare("SELECT last_lesson FROM users WHERE chat_id = ?").bind(String(chatId)).all();
      if (results && results.length > 0) {
        progress = results[0].last_lesson;
      }
    } catch (e) {}
  }

  if (progress >= lessons.length) progress = lessons.length - 1;

  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: `سلام! به آکادمی آموزش زبان اسپانیایی خوش آمدید. 🎓\n\nآخرین پیشرفت شما: بخش ${progress + 1} از ${lessons.length}\nبرای ادامه از کلیدهای پایین صفحه استفاده کنید.`,
    reply_markup: getPersistentKeyboard()
  });

  await sendLessonMenu(token, chatId, progress, db);
}

async function handleQuickMenu(token, chatId, db) {
  let progress = 0;
  if (db) {
    try {
      const { results } = await db.prepare("SELECT last_lesson FROM users WHERE chat_id = ?").bind(String(chatId)).all();
      if (results && results.length > 0) {
        progress = results[0].last_lesson;
      }
    } catch (e) {}
  }
  if (progress >= lessons.length) progress = lessons.length - 1;
  await sendLessonMenu(token, chatId, progress, db);
}

function getLessonsKeyboard(page = 1) {
  let keyboard = [];
  
  if (page === 1) {
    keyboard = [
      [{ text: "الفبای اسپانیایی", callback_data: "lesson_alphabet" }],
      [{ text: "درس ۱", callback_data: "lesson_1" }, { text: "درس ۲", callback_data: "lesson_2" }],
      [{ text: "درس ۳ 🔒", callback_data: "lesson_3" }, { text: "درس ۴ 🔒", callback_data: "lesson_4" }],
      [{ text: "درس ۵ 🔒", callback_data: "lesson_5" }, { text: "درس ۶ 🔒", callback_data: "lesson_6" }],
      [{ text: "درس ۷ 🔒", callback_data: "lesson_7" }, { text: "درس ۸ 🔒", callback_data: "lesson_8" }],
      [{ text: "درس ۹ 🔒", callback_data: "lesson_9" }, { text: "درس ۱۰ 🔒", callback_data: "lesson_10" }],
      [{ text: "➡️ صفحه بعد", callback_data: "lessons_page_2" }]
    ];
  } else {
    let startLesson = (page - 1) * 10 + 1;
    let endLesson = Math.min(page * 10, 61);
    let row = [];
    
    for (let i = startLesson; i <= endLesson; i++) {
      row.push({ text: `درس ${i} 🔒`, callback_data: `lesson_${i}` });
      if (row.length === 2) {
        keyboard.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      keyboard.push(row);
    }
    
    let navRow = [];
    if (page > 1) {
      navRow.push({ text: "⬅️ صفحه قبل", callback_data: `lessons_page_${page - 1}` });
    }
    if (endLesson < 61) {
      navRow.push({ text: "➡️ صفحه بعد", callback_data: `lessons_page_${page + 1}` });
    }
    if (navRow.length > 0) {
      keyboard.push(navRow);
    }
  }

  return { inline_keyboard: keyboard };
}

async function showLessonList(token, chatId, page = 1) {
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: `📚 فهرست کامل درس‌ها (صفحه ${page}):\n*(درس‌های ۳ به بعد نیازمند اشتراک هستند)*`,
    parse_mode: "Markdown",
    reply_markup: getLessonsKeyboard(page)
  });
}

async function editLessonList(token, chatId, messageId, page) {
  await telegramFetch(token, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: `📚 فهرست کامل درس‌ها (صفحه ${page}):\n*(درس‌های ۳ به بعد نیازمند اشتراک هستند)*`,
    parse_mode: "Markdown",
    reply_markup: getLessonsKeyboard(page)
  });
}

async function sendLessonMenu(token, chatId, lessonId, db) {
  if (lessonId >= 2) {
    let isPaid = 0;
    if (db) {
      try {
        const { results } = await db.prepare("SELECT is_paid FROM users WHERE chat_id = ?").bind(String(chatId)).all();
        if (results && results.length > 0) {
          isPaid = results[0].is_paid;
        }
      } catch (e) {}
    }

    if (!isPaid) {
      await telegramFetch(token, "sendMessage", {
        chat_id: chatId,
        text: `🔒 **محتوای ویژه و قفل‌شده**\n\nبرای دسترسی کامل به درس ۳ و باقی آموزش‌ها، لطفاً اشتراک خود را فعال کنید.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "💳 اطلاعات پرداخت و خرید اشتراک", callback_data: "pay_info" }],
            [{ text: "🔙 بازگشت به درس‌های رایگان", callback_data: "menu_0" }]
          ]
        }
      });
      return;
    }
  }

  const lesson = lessons[lessonId] || lessons[0];
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: `📖 **${lesson.title}**\n\nبخش ${lessonId + 1} از ${lessons.length}\nبرای یادگیری این بخش، گزینه‌های زیر را انتخاب کنید:`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📦 ۱. واژه‌نامه و تلفظ کلمات", callback_data: `step_vocab_${lessonId}` }],
        [{ text: "📖 ۲. ریدینگ و تلفظ متن", callback_data: `step_reading_${lessonId}` }],
        [{ text: "💡 ۳. تحلیل و نکات گرامری", callback_data: `step_analysis_${lessonId}` }],
        [{ text: "✍️ ۴. آزمون و سنجش تسلط", callback_data: `quiz_${lessonId}_0` }]
      ]
    }
  });
}

async function handleCallback(token, q, db) {
  const data = q.data;
  const chatId = q.message.chat.id;
  
  if (data === "list_lessons") {
    await showLessonList(token, chatId, 1);
  } 
  else if (data === "lesson_alphabet") {
    await sendLessonMenu(token, chatId, 0, db);
  }
  else if (data.startsWith("lesson_")) {
    const lessonNum = parseInt(data.split("_")[1]);
    const lessonId = lessonNum - 1;
    if (lessons[lessonId]) {
      await sendLessonMenu(token, chatId, lessonId, db);
    }
  }
  else if (data.startsWith("menu_")) {
    const lessonId = parseInt(data.split("_")[1]);
    await sendLessonMenu(token, chatId, lessonId, db);
  }
  else if (data.startsWith("step_vocab_")) {
    const lessonId = parseInt(data.split("_")[2]);
    const lesson = lessons[lessonId];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📦 **واژه‌نامه / الفبا - ${lesson.title}**:\n\n${lesson.vocab}\n\n------------------\n${lesson.phoneticVocab}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "➡️ مرحله بعد: ریدینگ متن", callback_data: `step_reading_${lessonId}` }],
          [{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]
        ]
      }
    });
  }
  else if (data.startsWith("step_reading_")) {
    const lessonId = parseInt(data.split("_")[2]);
    const lesson = lessons[lessonId];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📖 **ریدینگ و مکالمه - ${lesson.title}**:\n\n${lesson.reading}\n\n------------------\n${lesson.phoneticReading}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🗣 پخش تلفظ صوتی این متن", callback_data: `audio_${lessonId}` }],
          [{ text: "➡️ مرحله بعد: تحلیل و گرامر", callback_data: `step_analysis_${lessonId}` }],
          [{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]
        ]
      }
    });
  }
  else if (data.startsWith("step_analysis_")) {
    const lessonId = parseInt(data.split("_")[2]);
    const lesson = lessons[lessonId];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `💡 **تحلیل گرامری - ${lesson.title}**:\n\n${lesson.analysis}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✍️ ورود به آزمون این بخش", callback_data: `quiz_${lessonId}_0` }],
          [{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]
        ]
      }
    });
  }
  else if (data.startsWith("audio_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId];
    
    let textToRead = lesson.audioText || lesson.reading;
    if (textToRead.length > 250) {
      textToRead = textToRead.substring(0, 250);
    }
    textToRead = textToRead.replace(/\n/g, ". ");

    const cleanText = encodeURIComponent(textToRead);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=es&client=tw-ob&ttsspeed=0.8`;

    await telegramFetch(token, "sendAudio", {
      chat_id: chatId,
      audio: audioUrl,
      title: `تلفظ صوتی - ${lesson.title}`
    });
  }
  else if (data.startsWith("quiz_")) {
    const parts = data.split("_");
    const lessonId = parseInt(parts[1]);
    const qIndex = parseInt(parts[2]) || 0;
    const lesson = lessons[lessonId];
    
    if (!lesson.questions || lesson.questions.length === 0) {
      await telegramFetch(token, "sendMessage", { chat_id: chatId, text: "آزمونی برای این درس ثبت نشده است." });
      return;
    }

    const currentQ = lesson.questions[qIndex];

    if (currentQ.type === "لیسنینگ" && currentQ.audioText) {
      const cleanText = encodeURIComponent(currentQ.audioText);
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=es&client=tw-ob&ttsspeed=0.8`;

      await telegramFetch(token, "sendAudio", {
        chat_id: chatId,
        audio: audioUrl,
        title: "🎧 فایل صوتی آزمون لیسنینگ"
      });
    }

    const keyboard = [];
    currentQ.options.forEach((opt, idx) => {
      keyboard.push([{ text: opt, callback_data: `ans_${lessonId}_${qIndex}_${idx}` }]);
    });
    keyboard.push([{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]);

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `❓ **آزمون (${currentQ.type}) - سوال ${qIndex + 1} از ${lesson.questions.length}**\n\n${currentQ.text}`,
      reply_markup: { inline_keyboard: keyboard }
    });
  }
  else if (data.startsWith("ans_")) {
    const parts = data.split("_");
    const lessonId = parseInt(parts[1]);
    const qIndex = parseInt(parts[2]);
    const selected = parseInt(parts[3]);
    const lesson = lessons[lessonId];
    const currentQ = lesson.questions[qIndex];
    
    let resMsg = "";
    let nextButtons = [];
    
    if (selected === currentQ.correct) {
      resMsg = "✅ پاسخ شما درست است! 👏";
      
      if (qIndex + 1 < lesson.questions.length) {
        nextButtons.push({ text: "➡️ سوال بعدی آزمون", callback_data: `quiz_${lessonId}_${qIndex + 1}` });
      } else {
        resMsg += "\n\n🎉 تبریک! آزمون این درس را به طور کامل با موفقیت به پایان رساندید.";
        if (db) {
          try {
            await db.prepare(
              "INSERT INTO users (chat_id, last_lesson) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET last_lesson = ?"
            ).bind(String(chatId), lessonId + 1, lessonId + 1).run();
          } catch (e) {}
        }

        if (lessonId + 1 < lessons.length) {
          nextButtons.push({ text: "🚀 رفتن به درس بعدی", callback_data: `menu_${lessonId + 1}` });
        } else {
          nextButtons.push({ text: "🏠 بازگشت به منوی اصلی", callback_data: "menu_0" });
        }
      }
    } else {
      resMsg = `❌ پاسخ نادرست بود.\nپاسخ صحیح: ${currentQ.options[currentQ.correct]}`;
      nextButtons.push({ text: "🔄 تکرار همین سوال", callback_data: `quiz_${lessonId}_${qIndex}` });
      nextButtons.push({ text: "📖 مرور مجدد درس", callback_data: `menu_${lessonId}` });
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: resMsg,
      reply_markup: { inline_keyboard: [nextButtons] }
    });
  }
  
  await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
}

async function telegramFetch(token, method, body) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {}
            }
