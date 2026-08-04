// قالب‌ها و کلمات پایه برای ساخت بی‌نهایت درس و جمله پویا
const subjects = [
  { es: "Yo", fa: "من" }, { es: "Tú", fa: "تو" }, { es: "Él", fa: "او (مرد)" }, 
  { es: "Ella", fa: "او (زن)" }, { es: "Nosotros", fa: "ما" }, { es: "Ellos", fa: "آن‌ها" }
];

const verbs = [
  { es: "quiero", fa: "می‌خواهم", inf: "querer" },
  { es: "necesito", fa: "نیاز دارم", inf: "necesitar" },
  { es: "puedo", fa: "می‌توانم", inf: "poder" },
  { es: "tengo", fa: "دارم", inf: "tener" },
  { es: "voy a", fa: "می‌روم که / قصد دارم", inf: "ir" },
  { es: "me gusta", fa: "دوست دارم", inf: "gustar" },
  { es: "aprendo", fa: "یاد می‌گیرم", inf: "aprender" },
  { es: "busco", fa: "دنبال می‌گردم", inf: "buscar" }
];

const objects = [
  { es: "un café con leche", fa: "یک قهوه با شیر" },
  { es: "una habitación doble", fa: "یک اتاق دو تخته" },
  { es: "un billete de tren", fa: "یک بلیط قطار" },
  { es: "el baño más cercano", fa: "نزدیک‌ترین دستشویی" },
  { es: "ayuda por favor", fa: "کمک لطفاً" },
  { es: "agua fría", fa: "آب سرد" },
  { es: "un poco de práctica", fa: "کمی تمرین" },
  { es: "nueva información", fa: "اطلاعات جدید" },
  { es: "un buen libro", fa: "یک کتاب خوب" },
  { es: "comida española", fa: "غذای اسپانیایی" }
];

const placesOrTimes = [
  { es: "en la ciudad", fa: "در شهر" },
  { es: "mañana por la mañana", fa: "فردا صبح" },
  { es: "hoy por la tarde", fa: "امروز بعد از ظهر" },
  { es: "en el hotel", fa: "در هتل" },
  { es: "por favor", fa: "لطفاً" },
  { es: "rápidamente", fa: "به سرعت" },
  { es: "con mis amigos", fa: "با دوستانم" }
];

// تابع تولید درس بی‌نهایت و پویا بر اساس ID یا هش
function getInfiniteLesson(id) {
  // استفاده از آی‌دی برای انتخاب پایدارِ کلمات به صورت چرخشی و تصادفیِ منظم
  const sub = subjects[id % subjects.length];
  const verb = verbs[(id * 3) % verbs.length];
  const obj = objects[(id * 7) % objects.length];
  const extra = placesOrTimes[(id * 11) % placesOrTimes.length];

  const spanishText = `${sub.es} ${verb.es} ${obj.es} ${extra.es}.`;
  const persianMeaning = `${sub.fa} ${obj.fa} را ${verb.fa} ${extra.fa}.`;
  
  // تولید سوال چهار گزینه‌ای هوشمند بر اساس خودِ جمله
  return {
    id: id,
    text: spanishText,
    meaning: persianMeaning,
    phonetic: `تلفظ پویا برای درس شماره ${id + 1}`,
    question: `معنی فعل '${verb.es}' در این جمله چیست؟`,
    options: [verb.fa, "نمی‌دانم", "فردا", "هرگز"],
    correct: 0
  };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Bot is active");
    }
    
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      const db = env.DB;
      
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
  let welcomeText = "سلام! به ربات آموزش اسپانیایی با **بانک درس‌های بی‌نهایت و پویا** خوش آمدید. ♾️ اسپانیایی را بدون محدودیت یاد بگیرید!";

  if (lastLesson > 0) {
    welcomeText += `\n\nشما آخرین بار در **درس ${lastLesson + 1}** بودید. مایلید از کجا ادامه دهید؟`;
    keyboard = [
      [{ text: `▶️ ادامه از درس ${lastLesson + 1}`, callback_data: `lesson_${lastLesson}` }],
      [{ text: "🔄 شروع از درس اول (درس ۱)", callback_data: "lesson_0" }],
      [{ text: "🎲 درس تصادفیِ جدید", callback_data: `lesson_${Math.floor(Math.random() * 10000)}` }]
    ];
  } else {
    welcomeText += `\n\nبرای شروع یادگیری روی دکمه زیر بزنید:`;
    keyboard = [
      [{ text: "📖 شروع درس اول", callback_data: "lesson_0" }],
      [{ text: "🎲 درس تصادفیِ جدید", callback_data: `lesson_${Math.floor(Math.random() * 10000)}` }]
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
    const lesson = getInfiniteLesson(lessonId);
    
    try {
      await db.prepare(
        "INSERT INTO users (chat_id, last_lesson) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET last_lesson = ?"
      ).bind(chatId, lessonId, lessonId).run();
    } catch (e) {
      console.error("DB Write Error:", e);
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📖 درس شماره ${lessonId + 1} (پویا و بی‌نهایت):\n\n🇪🇸 ${lesson.text}`,
      reply_markup: { 
        inline_keyboard: [
          [
            { text: "🗣 تلفظ صوتی", callback_data: `audio_${lessonId}` },
            { text: "👁 نمایش معنی", callback_data: `meaning_${lessonId}` }
          ],
          [{ text: "✍️ امتحان این درس", callback_data: `quiz_${lessonId}` }],
          [{ text: "➡️ درس بعدی (شماره‌ی بعد)", callback_data: `lesson_${lessonId + 1}` }]
        ]
      }
    });
  } else if (data.startsWith("audio_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = getInfiniteLesson(lessonId);
    
    const cleanText = encodeURIComponent(lesson.text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=es&client=tw-ob`;

    await telegramFetch(token, "sendAudio", {
      chat_id: chatId,
      audio: audioUrl,
      title: `تلفظ درس ${lessonId + 1}`,
      performer: "Infinite Spanish Bot"
    });

  } else if (data.startsWith("meaning_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = getInfiniteLesson(lessonId);
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `🇮🇷 معنی: ${lesson.meaning}`
    });
  } else if (data.startsWith("quiz_")) {
    const lessonId = parseInt(data.split("_")[1]);
    const lesson = getInfiniteLesson(lessonId);
    
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
    const lesson = getInfiniteLesson(lessonId);
    
    let resultText = "";
    if (selectedOption === lesson.correct) {
      resultText = "✅ آفرین! پاسخ شما کاملاً درست است. 👏";
    } else {
      resultText = `❌ اشتباه بود.\nپاسخ درست: ${lesson.options[lesson.correct]}`;
    }

    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: resultText,
      reply_markup: { 
        inline_keyboard: [
          [{ text: "➡️ رفتن به درس بعدی", callback_data: `lesson_${lessonId + 1}` }],
          [{ text: "🎲 درس رندوم جدید", callback_data: `lesson_${Math.floor(Math.random() * 10000)}` }]
        ] 
      }
    });
  } else if (data === "back_home") {
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
    console.error("Telegram API Error:", e);
  }
}
