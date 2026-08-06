// src/index.js
import { lessons } from './lessons.js';

// تنظیمات کانال‌های اجباری
const CHANNEL_1 = "@nwechannell"; 
const CHANNEL_2 = "@parvapoem"; 

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Bot is active");
    }
    
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      const db = env.DB;
      
      if (!token) return new Response("OK");

      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        
        const isMember = await checkUserMembership(token, chatId);
        if (!isMember) return new Response("OK");

        if (text.startsWith("/start")) {
          await handleStart(token, chatId, db);
        } else {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: "لطفاً از دکمه‌های منو استفاده کنید."
          });
        }
      } else if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id;
        
        if (update.callback_query.data === "check_membership") {
          const isMember = await checkUserMembership(token, chatId);
          if (isMember) {
            await telegramFetch(token, "answerCallbackQuery", { 
              callback_query_id: update.callback_query.id, 
              text: "عضویت شما تأیید شد! خوش آمدید 🎉",
              show_alert: true 
            });
            await handleStart(token, chatId, db);
          } else {
            await telegramFetch(token, "answerCallbackQuery", { 
              callback_query_id: update.callback_query.id, 
              text: "شما هنوز در هر دو کانال عضو نشده‌اید یا ربات در کانال‌ها ادمین نیست!", 
              show_alert: true 
            });
          }
          return new Response("OK");
        }

        const isMember = await checkUserMembership(token, chatId);
        if (!isMember) return new Response("OK");

        await handleCallback(token, update.callback_query, db);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    
    return new Response("OK");
  }
};

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
      text: "❌ برای استفاده از ربات، لطفاً ابتدا در **دو کانال زیر** عضو شوید و سپس روی دکمه‌ی بررسی عضویت کلیک کنید:\n\n1️⃣ " + CHANNEL_1 + "\n2️⃣ " + CHANNEL_2,
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
    console.error("Membership check error:", e);
    // اگر به دلیل ادمین نبودن ربات ارور داد، موقتاً اجازه عبور می‌دهیم یا پیام خطا می‌دهیم
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
    } catch (e) {
      console.error("DB Read Error:", e);
    }
  }

  let keyboard = [
    [{ text: `🚀 ورود به پنل درس‌ها (آخرین پیشرفت: بخش ${progress + 1})`, callback_data: `menu_${progress}` }],
    [{ text: "📚 فهرست کامل درس‌ها", callback_data: "list_lessons" }]
  ];

  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: "سلام! به آکادمی آموزش زبان اسپانیایی (بر اساس کتاب آرام خواجه‌وند) خوش آمدید. 🎓\n\nهر بخش شامل واژه‌نامه الفبا/کلمات، تلفظ خط‌به‌خط زیرهم، ریدینگ، تحلیل گرامر و آزمون است.",
    reply_markup: { inline_keyboard: keyboard }
  });
}

async function handleCallback(token, q, db) {
  const data = q.data;
  const chatId = q.message.chat.id;
  
  if (data === "list_lessons") {
    let keyboard = [];
    lessons.forEach((l, idx) => {
      keyboard.push([{ text: l.title, callback_data: `menu_${idx}` }]);
    });
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: "لیست کامل درس‌های سیستم آموزشی:",
      reply_markup: { inline_keyboard: keyboard }
    });
  } 
  else if (data.startsWith("menu_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId] || lessons[0];
    
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📖 **${lesson.title}**\n\nبرای یادگیری این بخش، گزینه‌های زیر را انتخاب کنید:`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📦 ۱. واژه‌نامه و تلفظ کلمات", callback_data: `step_vocab_${lessonId}` }],
          [{ text: "📖 ۲. ریدینگ و تلفظ متن", callback_data: `step_reading_${lessonId}` }],
          [{ text: "💡 ۳. تحلیل و نکات گرامری", callback_data: `step_analysis_${lessonId}` }],
          [{ text: "✍️ ۴. آزمون و سنجش تسلط", callback_data: `quiz_${lessonId}` }],
          [{ text: "🏠 منوی اصلی", callback_data: "back_home" }]
        ]
      }
    });
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
          [{ text: "✍️ ورود به آزمون این بخش", callback_data: `quiz_${lessonId}` }],
          [{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]
        ]
      }
    });
  }
  else if (data.startsWith("audio_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId];
    const cleanText = encodeURIComponent(lesson.audioText);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=es&client=tw-ob`;

    await telegramFetch(token, "sendAudio", {
      chat_id: chatId,
      audio: audioUrl,
      title: `تلفظ صوتی - ${lesson.title}`
    });
  }
  else if (data.startsWith("quiz_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId];
    
    const keyboard = [];
    lesson.options.forEach((opt, idx) => {
      keyboard.push([{ text: opt, callback_data: `ans_${lessonId}_${idx}` }]);
    });
    keyboard.push([{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]);

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `❓ **آزمون ارزیابی - ${lesson.title}**:\n\n${lesson.question}`,
      reply_markup: { inline_keyboard: keyboard }
    });
  }
  else if (data.startsWith("ans_")) {
    const parts = data.split("_");
    const lessonId = parseInt(parts[1]);
    const selected = parseInt(parts[2]);
    const lesson = lessons[lessonId];
    
    let resMsg = "";
    let nextButtons = [];
    
    if (selected === lesson.correct) {
      resMsg = "✅ پاسخ شما کاملاً درست است! این بخش را با موفقیت یاد گرفتید. 👏";
      
      if (db) {
        try {
          await db.prepare(
            "INSERT INTO users (chat_id, last_lesson) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET last_lesson = ?"
          ).bind(String(chatId), lessonId + 1, lessonId + 1).run();
        } catch (e) {
          console.error("DB Write Error:", e);
        }
      }

      if (lessonId + 1 < lessons.length) {
        nextButtons.push({ text: "🚀 رفتن به درس بعدی", callback_data: `menu_${lessonId + 1}` });
      } else {
        nextButtons.push({ text: "🎉 تبریک! تمام بخش‌های فعلی به پایان رسید", callback_data: "back_home" });
      }
    } else {
      resMsg = `❌ پاسخ نادرست بود.\nپاسخ صحیح: ${lesson.options[lesson.correct]}`;
      nextButtons.push({ text: "🔄 تلاش مجدد در آزمون", callback_data: `quiz_${lessonId}` });
      nextButtons.push({ text: "📖 مرور مجدد درس", callback_data: `menu_${lessonId}` });
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: resMsg,
      reply_markup: { inline_keyboard: [nextButtons] }
    });
  }
  else if (data === "back_home") {
    await handleStart(token, chatId, db);
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
  } catch (e) {
    console.error("Telegram Fetch Error:", e);
  }
}
