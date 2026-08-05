// دیتابیس دروس با ساختار کاملاً تفکیک‌شده و تلفظ‌های نوشتاریِ زیرهم
const lessons = [
  {
    id: 0,
    title: "درس ۱: احوالپرسی و معرفی اولیه",
    vocab: "• Hola ➔ سلام\n• ¿Cómo estás? ➔ چطور هستی؟\n• Gracias ➔ ممنون\n• Buenos días ➔ صبح بخیر",
    phoneticVocab: "🔤 تلفظ واژگان:\n• اُلا (سلام)\n• کومو استاس؟ (چطور هستی؟)\n• گراسیاس (ممنون)\n• بوئنوس دیاس (صبح بخیر)",
    reading: "🇪🇸 ¡Hola, buenos días! ¿Cómo estás?\n🇮🇷 سلام، صبح بخیر! چطور هستی؟\n\n🇪🇸 Estoy muy bien, gracias. ¿Y tú?\n🇮🇷 من خیلی خوبم، ممنون. و تو؟",
    phoneticReading: "🔤 تلفظ متن:\n• ¡Hola, buenos días! ¿Cómo estás?\n(اُلا، بوئنوس دیاس! کومو استاس؟)\n\n• Estoy muy bien, gracias. ¿Y tú?\n(استوی موئی بین، گراسیاس. ای تو؟)",
    audioText: "¡Hola, buenos días! ¿Cómo estás? Estoy muy bien, gracias.",
    analysis: "نکته گرامری:\nدر زبان اسپانیایی حرف 'H' در اول کلمات تلفظ نمی‌شود (مثل Hola که اُلا خوانده می‌شود). علامت سوال در ابتدای جملات (¿) برعکس گذاشته می‌شود.",
    question: "طبق ریدینگ بالا، کاربر در پاسخ به حالِ خوبش چه کلمه‌ای گفته است؟",
    options: ["Gracias (ممنون)", "Mal (بد)", "Adios (خداحافظ)", "No (نه)"],
    correct: 0
  },
  {
    id: 1,
    title: "درس ۲: ملیت و محل زندگی",
    vocab: "• ¿De dónde eres? ➔ اهل کجایی؟\n• Soy de... ➔ من اهل... هستم\n• Vivir ➔ زندگی کردن\n• Ciudad ➔ شهر",
    phoneticVocab: "🔤 تلفظ واژگان:\n• دِ دونده اِرِس؟ (اهل کجایی؟)\n• سوی دِ... (من اهل... هستم)\n• بیبیر (زندگی کردن)\n• سیوداد (شهر)",
    reading: "🇪🇸 ¿De dónde eres tú?\n🇮🇷 تو اهل کجایی؟\n\n🇪🇸 Soy de Irán y vivo en Teherán.\n🇮🇷 من اهل ایران هستم و در تهران زندگی می‌کنم.",
    phoneticReading: "🔤 تلفظ متن:\n• ¿De dónde eres tú?\n(دِ دونده اِرِس تو؟)\n\n• Soy de Irán y vivo en Teherán.\n(سویی دِ ایران ای بیبو ان تهران.)",
    audioText: "¿De dónde eres tú? Soy de Irán y vivo en Teherán.",
    analysis: "نکته گرامری:\nبرای گفتن محل زندگی از فعل 'vivir' استفاده می‌شود. ترکیب 'vivo en' یعنی «من زندگی می‌کنم در...»",
    question: "فعل 'vivo' در جمله به چه معناست؟",
    options: ["کار می‌کنم", "زندگی می‌کنم", "سفر می‌کنم", "خرید می‌کنم"],
    correct: 1
  },
  {
    id: 2,
    title: "درس ۳: خرید و کافه (سفارش دادن)",
    vocab: "• Café con leche ➔ قهوه با شیر\n• Por favor ➔ لطفاً\n• Cuánto cuesta ➔ چقدر قیمت دارد\n• Agua ➔ آب",
    phoneticVocab: "🔤 تلفظ واژگان:\n• کافه کون لچه (قهوه با شیر)\n• پور فاور (لطفاً)\n• کوانتو کوئستا (چقدر قیمت دارد)\n• آگوا (آب)",
    reading: "🇪🇸 Por favor, un café con leche y un poco de agua fría.\n🇮🇷 لطفاً یک قهوه با شیر و کمی آب سرد.\n\n🇪🇸 ¿Cuánto cuesta esto?\n🇮🇷 این چقدر قیمت دارد؟",
    phoneticReading: "🔤 تلفظ متن:\n• Por favor, un café con leche y un poco de agua fría.\n(پور فاور، اون کافه کون لچه ای اون پوکو دِ آگوا فرییا.)\n\n• ¿Cuánto cuesta esto?\n(کوانتو کوئستا استو؟)",
    audioText: "Por favor, un café con leche y un poco de agua fría.",
    analysis: "نکته مهم:\nعبارت 'Por favor' یکی از پرکاربردترین اصطلاحات مؤدبانه در اسپانیا و آمریکای لاتین است.",
    question: "عبارت 'Por favor' یعنی چه؟",
    options: ["متشکرم", "لطفاً", "ببخشید", "خداحافظ"],
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
      const db = env.DB;
      
      if (!token) return new Response("OK");

      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        
        if (text.startsWith("/start")) {
          await handleStart(token, chatId, db);
        } else {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: "لطفاً از دکمه‌های منو استفاده کنید."
          });
        }
      } else if (update.callback_query) {
        await handleCallback(token, update.callback_query, db);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    
    return new Response("OK");
  }
};

async function handleStart(token, chatId, db) {
  let progress = 0;
  try {
    const { results } = await db.prepare("SELECT last_lesson FROM users WHERE chat_id = ?").bind(chatId).all();
    if (results && results.length > 0) progress = results[0].last_lesson;
  } catch (e) {}

  let keyboard = [
    [{ text: `🚀 ورود به پنل درس‌ها (آخرین پیشرفت: درس ${progress + 1})`, callback_data: `menu_${progress}` }],
    [{ text: "📚 فهرست کامل درس‌ها", callback_data: "list_lessons" }]
  ];

  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: "سلام! به آکادمی تخصصی آموزش زبان اسپانیایی خوش آمدید. 🎓\n\nهر درس شامل واژه‌نامه، تلفظ خط‌به‌خط، ریدینگ، تحلیل گرامر و آزمون است.",
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
      text: `📖 **${lesson.title}**\n\nبرای یادگیری عمیق این درس، بخش‌های زیر را دنبال کنید:`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📦 ۱. واژه‌نامه و تلفظ کلمات", callback_data: `step_vocab_${lessonId}` }],
          [{ text: "📖 ۲. ریدینگ و تلفظ متن", callback_data: `step_reading_${lessonId}` }],
          [{ text: "💡 ۳. درک معنا و تحلیل گرامر", callback_data: `step_analysis_${lessonId}` }],
          [{ text: "✍️ ۴. آزمون و سنجش تسلط", callback_data: `quiz_${lessonId}` }],
          [{ text: "🏠 منوی اصلی", callback_data: "back_home" }]
        ]
      }
    });
  }
  // بخش ۱: واژه‌نامه + تلفظ نوشتاری زیرهم
  else if (data.startsWith("step_vocab_")) {
    const lessonId = parseInt(data.split("_")[2]);
    const lesson = lessons[lessonId];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📦 **واژه‌نامه ${lesson.title}**:\n\n${lesson.vocab}\n\n------------------\n${lesson.phoneticVocab}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "➡️ مرحله بعد: ریدینگ متن", callback_data: `step_reading_${lessonId}` }],
          [{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]
        ]
      }
    });
  }
  // بخش ۲: ریدینگ + تلفظ نوشتاری زیرهم + صوت اختصاصی
  else if (data.startsWith("step_reading_")) {
    const lessonId = parseInt(data.split("_")[2]);
    const lesson = lessons[lessonId];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📖 **ریدینگ و مکالمه ${lesson.title}**:\n\n${lesson.reading}\n\n------------------\n${lesson.phoneticReading}`,
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
  // بخش ۳: تحلیل معنایی
  else if (data.startsWith("step_analysis_")) {
    const lessonId = parseInt(data.split("_")[2]);
    const lesson = lessons[lessonId];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `💡 **تحلیل معنایی و نکات ${lesson.title}**:\n\n${lesson.analysis}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✍️ ورود به آزمون این درس", callback_data: `quiz_${lessonId}` }],
          [{ text: "🔙 بازگشت به منوی درس", callback_data: `menu_${lessonId}` }]
        ]
      }
    });
  }
  // صوت اختصاصی بر اساس متن همان درس
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
  // بخش ۴: آزمون
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
      text: `❓ **آزمون ارزیابی ${lesson.title}**:\n\n${lesson.question}`,
      reply_markup: { inline_keyboard: keyboard }
    });
  }
  // بررسی پاسخ آزمون
  else if (data.startsWith("ans_")) {
    const parts = data.split("_");
    const lessonId = parseInt(parts[1]);
    const selected = parseInt(parts[2]);
    const lesson = lessons[lessonId];
    
    let resMsg = "";
    let nextButtons = [];
    
    if (selected === lesson.correct) {
      resMsg = "✅ پاسخ شما کاملاً درست است! این درس را با موفقیت یاد گرفتید. 👏";
      
      try {
        await db.prepare(
          "INSERT INTO users (chat_id, last_lesson) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET last_lesson = ?"
        ).bind(chatId, lessonId + 1, lessonId + 1).run();
      } catch (e) {}

      if (lessonId + 1 < lessons.length) {
        nextButtons.push({ text: "🚀 رفتن به درس بعدی", callback_data: `menu_${lessonId + 1}` });
      } else {
        nextButtons.push({ text: "🎉 تبریک! تمام درس‌ها به پایان رسید", callback_data: "back_home" });
      }
    } else {
      resMsg = `❌ پاسخ نادرست بود.\nپاسخ صحیح: ${lesson.options[lesson.correct]}`;
      nextButtons.push({ text: "🔄 تلاش مجدد در آزمون", callback_data: `quiz_${lessonId}` });
      nextButtons.push({ text: "📖 مرور مجدد واژه‌ها و ریدینگ", callback_data: `menu_${lessonId}` });
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
  } catch (e) {}
}
