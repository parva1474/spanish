const lessons = [
  { 
    id: 0, 
    text: "Hola, ¿cómo estás?", 
    meaning: "سلام، چطور هستی؟", 
    phonetic: "اولا، کومو استاس",
    question: "معنی کلمه 'Hola' چیست؟", 
    options: ["سلام", "خداحافظ", "ممنون", "لطفاً"], 
    correct: 0 
  },
  { 
    id: 1, 
    text: "¿De dónde eres? Soy de Irán.", 
    meaning: "اهل کجایی؟ من اهل ایران هستم.", 
    phonetic: "دِ دونده اِرِس؟ سوی دِ ایران.",
    question: "معنی '¿De dónde eres?' چیست؟", 
    options: ["حالت چطوره؟", "اسمت چیه؟", "اهل کجایی؟", "کجا زندگی می‌کنی؟"], 
    correct: 2 
  },
  { 
    id: 2, 
    text: "Buenos días, ¿qué tal?", 
    meaning: "صبح بخیر، اوضاع چطور است؟", 
    phonetic: "بوئنوس دیاس، کِ تال؟",
    question: "معنی 'Buenos días' چیست؟", 
    options: ["شب بخیر", "صبح بخیر", "عصر بخیر", "خداحافظ"], 
    correct: 1 
  },
  { 
    id: 3, 
    text: "Muchas gracias, de nada.", 
    meaning: "خیلی ممنون، خواهش می‌کنم.", 
    phonetic: "موچاس گراسیاس، دِ نادا.",
    question: "معنی عبارت 'de nada' چیست؟", 
    options: ["خواهش می‌کنم", "ممنون", "متأسفم", "خواهش نمی‌کنم"], 
    correct: 0 
  },
  { 
    id: 4, 
    text: "Hablo un poco de español.", 
    meaning: "من کمی اسپانیایی صحبت می‌کنم.", 
    phonetic: "آبلو اون پوکو دِ اسپانیول.",
    question: "معنی 'un poco' چیست؟", 
    options: ["زیاد", "روان", "کمی", "اصلاً"], 
    correct: 2 
  },
  { 
    id: 5, 
    text: "¿Cuánto cuesta esto?", 
    meaning: "این چقدر قیمت دارد؟ (قیمت چند است؟)", 
    phonetic: "کوانتو کوئستا استو؟",
    question: "برای پرسیدن قیمت یک جنس از چه عبارتی استفاده می‌شود؟", 
    options: ["¿Dónde está?", "¿Cuánto cuesta esto?", "¿Qué hora es?", "Hola"], 
    correct: 1 
  },
  { 
    id: 6, 
    text: "No entiendo, por favor hable más despacio.", 
    meaning: "متوجه نمی‌شوم، لطفاً آرام‌تر صحبت کنید.", 
    phonetic: "نو انتیِندو، پور فاور آبله ماس دسپاسیو.",
    question: "عبارت 'más despacio' یعنی چه؟", 
    options: ["بلندتر", "آرام‌تر / یواش‌تر", "سریع‌تر", "دوباره"], 
    correct: 1 
  },
  { 
    id: 7, 
    text: "Por favor, un café.", 
    meaning: "لطفاً یک قهوه.", 
    phonetic: "پور فاور، اون کافه.",
    question: "کلمه 'Por favor' به چه معناست؟", 
    options: ["ممنون", "سلام", "لطفاً", "ببخشید"], 
    correct: 2 
  },
  { 
    id: 8, 
    text: "¡Adiós! Hasta luego.", 
    meaning: "خداحافظ! تا بعد.", 
    phonetic: "آدیوس! آستا لوئگو.",
    question: "معنی 'Hasta luego' چیست؟", 
    options: ["تا بعد / به امید دیدار", "خوش آمدید", "صبح بخیر", "روز خوبی داشته باشید"], 
    correct: 0 
  },
  { 
    id: 9, 
    text: "Me llamo Ali. چه خبر؟ (¿Y tú?)", 
    meaning: "اسم من علی است. و تو؟", 
    phonetic: "مِ یامو علی. ای تو؟",
    question: "برای پرسیدن نام طرف مقابل از کدام عبارت استفاده شده است؟", 
    options: ["¿Cómo estás?", "¿Y tú?", "¿De dónde eres?", "Buenos días"], 
    correct: 1 
  }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Bot is active");
    }
    
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      const db = env.DB; // اتصال به دیتابیس D1
      
      if (!token) {
        console.error("Token is missing in environment variables!");
        return new Response("OK");
      }

      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        
        if (text.startsWith("/start")) {
          await handleStart(token, chatId, db);
        } else {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: "لطفاً از دکمه‌های منو یا دستور /start استفاده کنید."
          });
        }
      } else if (update.callback_query) {
        await handleCallback(token, update.callback_query, db);
      }
      
    } catch (err) {
      console.error("Error processing update:", err);
    }
    
    return new Response("OK");
  }
};

async function handleStart(token, chatId, db) {
  // بررسی آخرین درس کاربر در دیتابیس
  let lastLesson = 0;
  try {
    const { results } = await db.prepare("SELECT last_lesson FROM users WHERE chat_id = ?").bind(chatId).all();
    if (results && results.length > 0) {
      lastLesson = results[0].last_lesson;
    }
  } catch (e) {
    console.error("DB Read Error:", e);
  }

  let keyboard = [];
  let welcomeText = "سلام! به ربات آموزش اسپانیایی خوش آمدید.";

  if (lastLesson > 0) {
    welcomeText += `\n\nشما آخرین بار در **درس ${lastLesson + 1}** بودید. مایلید از کجا ادامه دهید؟`;
    keyboard = [
      [{ text: `▶️ ادامه از آخرین درس (درس ${lastLesson + 1})`, callback_data: `lesson_${lastLesson}` }],
      [{ text: "🔄 شروع از درس اول (درس ۱)", callback_data: "lesson_0" }],
      [{ text: "📊 تعیین سطح", callback_data: "placement_test" }]
    ];
  } else {
    welcomeText += "\n\nبرای شروع یادگیری روی درس اول بزنید:";
    keyboard = [
      [{ text: "📖 شروع درس‌ها (درس ۱)", callback_data: "lesson_0" }],
      [{ text: "📊 تعیین سطح", callback_data: "placement_test" }]
    ];
  }

  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: welcomeText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: keyboard }
  });
}

async function handleCallback(token, q, db) {
  const data = q.data;
  const chatId = q.message.chat.id;
  
  if (data.startsWith("lesson_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId];
    
    if (lesson) {
      // ذخیره آخرین درس دیده شده در دیتابیس
      try {
        await db.prepare(
          "INSERT INTO users (chat_id, last_lesson) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET last_lesson = ?"
        ).bind(chatId, lessonId, lessonId).run();
      } catch (e) {
        console.error("DB Write Error:", e);
      }

      await telegramFetch(token, "sendMessage", {
        chat_id: chatId,
        text: `📖 درس ${lessonId + 1} از ${lessons.length}:\n\n🇪🇸 ${lesson.text}`,
        reply_markup: { 
          inline_keyboard: [
            [
              { text: "🗣 تلفظ صوتی", callback_data: `audio_${lessonId}` },
              { text: "🔤 تلفظ نوشتاری", callback_data: `phonetic_${lessonId}` }
            ],
            [{ text: "👁 نمایش معنی", callback_data: `meaning_${lessonId}` }],
            [{ text: "✍️ امتحان این درس", callback_data: `quiz_${lessonId}` }]
          ]
        }
      });
    }
  } else if (data.startsWith("audio_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId];
    
    const cleanText = encodeURIComponent(lesson.text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=es&client=tw-ob`;

    await telegramFetch(token, "sendAudio", {
      chat_id: chatId,
      audio: audioUrl,
      title: `تلفظ درس ${lessonId + 1}`,
      performer: "Spanish Bot"
    });

  } else if (data.startsWith("phonetic_")) {
    const lessonId = parseInt(data.split("_")[1]);
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `🔤 تلفظ نوشتاری:\n${lessons[lessonId].phonetic}`
    });
  } else if (data.startsWith("meaning_")) {
    const lessonId = parseInt(data.split("_")[1]);
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `🇮🇷 معنی: ${lessons[lessonId].meaning}`
    });
  } else if (data.startsWith("quiz_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = lessons[lessonId];
    
    const keyboard = [];
    for (let i = 0; i < lesson.options.length; i += 2) {
      const row = [];
      row.push({ text: lesson.options[i], callback_data: `ans_${lessonId}_${i}` });
      if (i + 1 < lesson.options.length) {
        row.push({ text: lesson.options[i + 1], callback_data: `ans_${lessonId}_${i + 1}` });
      }
      keyboard.push(row);
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `❓ آزمون درس ${lessonId + 1}:\n\n${lesson.question}`,
      reply_markup: { inline_keyboard: keyboard }
    });
  } else if (data.startsWith("ans_")) {
    const parts = data.split("_");
    const lessonId = parseInt(parts[1]);
    const selectedOption = parseInt(parts[2]);
    const lesson = lessons[lessonId];
    
    let resultText = "";
    if (selectedOption === lesson.correct) {
      resultText = "✅ آفرین! پاسخ شما کاملاً درست است. 👏";
    } else {
      resultText = `❌ اشتباه بود.\nپاسخ درست: ${lesson.options[lesson.correct]}`;
    }

    const nextButtons = [];
    if (lessonId + 1 < lessons.length) {
      nextButtons.push({ text: "➡️ درس بعدی", callback_data: `lesson_${lessonId + 1}` });
    } else {
      nextButtons.push({ text: "🎉 پایان درس‌ها (بازگشت به شروع)", callback_data: "back_home" });
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: resultText,
      reply_markup: { inline_keyboard: [nextButtons] }
    });
  } else if (data === "back_home") {
    await handleStart(token, chatId, db);
  } else if (data === "placement_test") {
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: "سوال تعیین سطح: کلمه 'Gracias' به چه معناست؟",
      reply_markup: {
        inline_keyboard: [
          [{ text: "ممنون", callback_data: "level_correct" }, { text: "سلام", callback_data: "level_wrong" }]
        ]
      }
    });
  } else if (data === "level_correct" || data === "level_wrong") {
    const text = data === "level_correct" ? "عالی! سطح شما متوسط است." : "سطح شما مبتدی است.";
    await telegramFetch(token, "sendMessage", { chat_id: chatId, text });
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
    console.error("Telegram API Error:", e);
  }
    }
