const lessons = [
  { 
    id: 0, 
    text: "Hola, ¿cómo estás? Estoy muy bien, gracias.", 
    meaning: "سلام، چطور هستی؟ من خیلی خوبم، ممنون.", 
    phonetic: "اولا، کومو استاس؟ استوی موئی بین، گراسیاس.",
    question: "معنی کلمه 'Hola' چیست؟", 
    options: ["سلام", "خداحافظ", "ممنون", "لطفاً"], 
    correct: 0 
  },
  { 
    id: 1, 
    text: "¿De dónde eres? Soy de Irán y vivo en Teهرآن.", 
    meaning: "اهل کجایی؟ من اهل ایران هستم و در تهران زندگی می‌کنم.", 
    phonetic: "دِ دونده اِرِس؟ سوی دِ ایران ای بیبو ان تهران.",
    question: "معنی '¿De dónde eres?' چیست؟", 
    options: ["حالت چطوره؟", "اسمت چیه؟", "اهل کجایی؟", "کجا زندگی می‌کنی؟"], 
    correct: 2 
  },
  { 
    id: 2, 
    text: "Buenos días, ¿qué tal tu día hoy?", 
    meaning: "صبح بخیر، امروز اوضاع روزگارت چطور است؟", 
    phonetic: "بوئنوس دیاس، کِ تال تو دیا اوی؟",
    question: "معنی 'Buenos días' چیست؟", 
    options: ["شب بخیر", "صبح بخیر", "عصر بخیر", "خداحافظ"], 
    correct: 1 
  },
  { 
    id: 3, 
    text: "Muchas gracias por tu ayuda, de nada amigo.", 
    meaning: "خیلی ممنون برای کمکت، خواهش می‌کنم دوست من.", 
    phonetic: "موچاس گراسیاس پور تو آیودا، دِ نادا آمیگو.",
    question: "معنی عبارت 'de nada' چیست؟", 
    options: ["خواهش می‌کنم", "ممنون", "متأسفم", "خواهش نمی‌کنم"], 
    correct: 0 
  },
  { 
    id: 4, 
    text: "Hablo un poco de español, pero estoy aprendiendo rápido.", 
    meaning: "من کمی اسپانیایی صحبت می‌کنم، اما دارم سریع یاد می‌گیرم.", 
    phonetic: "آبلو اون پوکو دِ اسپانیول، پرو استوی آپرندیندو راپیدو.",
    question: "معنی 'un poco' چیست؟", 
    options: ["زیاد", "روان", "کمی", "اصلاً"], 
    correct: 2 
  },
  { 
    id: 5, 
    text: "¿Cuánto cuesta esto? Es demasiado caro para mí.", 
    meaning: "این چقدر قیمت دارد؟ این برای من خیلی گران است.", 
    phonetic: "کوانتو کوئستا استو؟ است دِماسیادو کارو پارا می.",
    question: "برای پرسیدن قیمت یک جنس از چه عبارتی استفاده می‌شود؟", 
    options: ["¿Dónde está?", "¿Cuánto cuesta esto?", "¿Qué hora es?", "Hola"], 
    correct: 1 
  },
  { 
    id: 6, 
    text: "No entiendo, por favor hable más despacio y repita.", 
    meaning: "متوجه نمی‌شوم، لطفاً آرام‌تر صحبت کنید و تکرار کنید.", 
    phonetic: "نو انتیِندو، پور فاور آبله ماس دسپاسیو ای رپیتا.",
    question: "عبارت 'más despacio' یعنی چه؟", 
    options: ["بلندتر", "آرام‌تر / یواش‌تر", "سریع‌تر", "دوباره"], 
    correct: 1 
  },
  { 
    id: 7, 
    text: "Por favor, un café con leche y un poco de agua.", 
    meaning: "لطفاً یک قهوه با شیر و کمی آب.", 
    phonetic: "پور فاور، اون کافه کون لچه ای اون پوکو دِ آگوا.",
    question: "کلمه 'Por favor' به چه معناست؟", 
    options: ["ممنون", "سلام", "لطفاً", "ببخشید"], 
    correct: 2 
  },
  { 
    id: 8, 
    text: "¡Adiós! Hasta luego, que tengas un excelente día.", 
    meaning: "خداحافظ! تا بعد، روز فوق‌العاده‌ای داشته باشی.", 
    phonetic: "آدیوس! آستا لوئگو، کِ تنگاس اون اکسلنت دیا.",
    question: "معنی 'Hasta luego' چیست؟", 
    options: ["تا بعد / به امید دیدار", "خوش آمدید", "صبح بخیر", "روز خوبی داشته باشید"], 
    correct: 0 
  },
  { 
    id: 9, 
    text: "Me llamo علی. ¿Cómo se llama usted?", 
    meaning: "اسم من علی است. اسم شما چیست؟ (محترمانه)", 
    phonetic: "مِ یامو علی. کومو سِ یاما اوستد؟",
    question: "برای پرسیدن نام شخص به صورت محترمانه از چه عبارتی استفاده می‌شود؟", 
    options: ["¿Cómo te llamas?", "¿Cómo se llama usted?", "¿De dónde eres?", "Hola"], 
    correct: 1 
  },
  { 
    id: 10, 
    text: "¿Dónde está el baño más cercano, por favor?", 
    meaning: "نزدیک‌ترین دستشویی کجاست، لطفاً؟", 
    phonetic: "دونده استا ال بانیو ماس سرکانو، پور فاور؟",
    question: "معنی 'el baño' چیست؟", 
    options: ["فرودگاه", "هتل", "دستشویی", "رستوران"], 
    correct: 2 
  },
  { 
    id: 11, 
    text: "Tengo mucha hambre y sed. Quiero comer algo rico.", 
    meaning: "خیلی گرسنه‌ام و تشنه‌ام. می‌خواهم یک چیز خوشمزه بخورم.", 
    phonetic: "تنگو موچا امبره ای سد. کییرو کومر آلگو ریکو.",
    question: "معنی کلمه 'hambre' چیست؟", 
    options: ["تشنه", "گرسنه", "خسته", "خوشحال"], 
    correct: 1 
  },
  { 
    id: 12, 
    text: "¿Qué hora es? Son las tres y media de la tarde.", 
    meaning: "ساعت چند است؟ ساعت سه و نیم بعد از ظهر است.", 
    phonetic: "کِ اورا است اس؟ سون لاس ترس ای مدیا دِ لا تارده.",
    question: "برای پرسیدن ساعت از کدام عبارت استفاده می‌شود؟", 
    options: ["¿Qué hora es?", "¿Cuánto cuesta?", "¿Dónde estás?", "Buenos días"], 
    correct: 0 
  },
  { 
    id: 13, 
    text: "No hablo español muy bien todavía. Necesito práctica diaria.", 
    meaning: "هنوز اسپانیایی را خیلی خوب صحبت نمی‌کنم. به تمرین روزانه نیاز دارم.", 
    phonetic: "نو آبلو اسپانیول موئی بین تودافیا. نسیسیتو پراکتیکا دیاریا.",
    question: "معنی کلمه 'Necesito' چیست؟", 
    options: ["می‌دانم", "نیاز دارم", "نمی‌خواهم", "دوست دارم"], 
    correct: 1 
  },
  { 
    id: 14, 
    text: "Me gusta viajar por el mundo y conocer nuevas culturas.", 
    meaning: "سفر کردن در دنیا و شناخت فرهنگ‌های جدید را دوست دارم.", 
    phonetic: "مِ گوستا بیاخار پور ال موندو ای کونوسر نوئباس culturas.",
    question: "فعل 'viajar' به چه معناست؟", 
    options: ["خوردن", "کار کردن", "سفر کردن", "خوابیدن"], 
    correct: 2 
  },
  { 
    id: 15, 
    text: "Disculpe, ¿dónde puedo comprar یک بلیط قطار؟", 
    meaning: "ببخشید، کجا می‌توانم یک بلیط قطار بخرم؟", 
    phonetic: "دیسکولپه، دونده پدو کومپر اون بالت دِ ترن؟",
    question: "معنی 'billete' یا 'boleto' چیست؟", 
    options: ["کفش", "بلیط", "کیف", "صندلی"], 
    correct: 1 
  },
  { 
    id: 16, 
    text: "El tiempo hoy está muy bien, hace sol و no llueve.", 
    meaning: "هوای امروز خیلی خوب است، آفتابی است و باران نمی‌بارد.", 
    phonetic: "ال تیمپو اوی است موئی بین، آسِه سول ای نو یوئبه.",
    question: "کلمه 'sol' یعنی چه؟", 
    options: ["باران", "برف", "آفتاب / خورشید", "باد"], 
    correct: 2 
  },
  { 
    id: 17, 
    text: "Mañana voy a visitar a un viejo amigo en la ciudad.", 
    meaning: "فردا قرار است به دیدن یک دوست قدیمی در شهر بروم.", 
    phonetic: "مانیانا بوی آ بیسیتار آ اون بیه‌خو آمیگو ان لا سیوداد.",
    question: "معنی 'mañana' چیست؟", 
    options: ["دیروز", "امروز", "فردا / صبح", "هفته پیش"], 
    correct: 2 
  },
  { 
    id: 18, 
    text: "¿Puede ayudarme, por favor? He perdido mi pasaporte.", 
    meaning: "می‌توانید کمکم کنید، لطفاً؟ پاسپورتم را گم کرده‌ام.", 
    phonetic: "پویده آیودارمه، پور فاور؟ اِ پردیدو می پاساپورته.",
    question: "معنی 'pasaporte' چیست؟", 
    options: ["چمدان", "پاسپورت / گذرنامه", "بلیط", "نقشه"], 
    correct: 1 
  },
  { 
    id: 19, 
    text: "Me gustaría reservar una habitación doble para dos noches.", 
    meaning: "دوست دارم یک اتاق دو تخته برای دو شب رزرو کنم.", 
    phonetic: "مِ گوستاریا رسربار اونا ابیتاسیون دوبله پارا دوس نوچس.",
    question: "فعل 'reservar' یعنی چه؟", 
    options: ["رزرو کردن", "فروختن", "شکستن", "پیدا کردن"], 
    correct: 0 
  },
  { 
    id: 20, 
    text: "Los números en español: uno, dos, tres, cuatro, cinco.", 
    meaning: "اعداد به زبان اسپانیایی: یک، دو، سه، چهار، پنج.", 
    phonetic: "لوس نومروس ان اسپانیول: اونو، دوس، ترس، کواترو، سینکو.",
    question: "عدد 'tres' یعنی چند؟", 
    options: ["یک", "دو", "سه", "چهار"], 
    correct: 2 
  },
  { 
    id: 21, 
    text: "Continuamos con los números: seis, siete, ocho, nueve, diez.", 
    meaning: "ادامه با اعداد: شش، هفت، هشت، نه، ده.", 
    phonetic: "کونتینواموس کون لوس نومروس: سیس، سیه‌ته، اوچو، نوئبه، دیه‌س.",
    question: "عدد 'diez' یعنی چند؟", 
    options: ["پنج", "هفت", "ده", "نه"], 
    correct: 2 
  },
  { 
    id: 22, 
    text: "¿Cuál es tu color favorito? Mi color favorito es el azul.", 
    meaning: "رنگ مورد علاقه تو چیست؟ رنگ مورد علاقه من آبی است.", 
    phonetic: "کوال است تو کولور فاوریتو؟ می کولور فاوریتو است ال آزول.",
    question: "رنگ 'azul' چه رنگی است؟", 
    options: ["قرمز", "سبز", "آبی", "زرد"], 
    correct: 2 
  },
  { 
    id: 23, 
    text: "Tengo یک برادر و دو خواهر کوچکتر.", 
    meaning: "من یک برادر و دو خواهر کوچکتر دارم.", 
    phonetic: "تنگو اون ِرمانو ای دوس کوئرس یا ارماناس.",
    question: "کلمه 'hermano' یعنی چه؟", 
    options: ["خواهر", "برادر", "پدر", "مادر"], 
    correct: 1 
  },
  { 
    id: 24, 
    text: "Me encanta la comida española, especialmente la paella.", 
    meaning: "من عاشق غذای اسپانیایی هستم، به‌خصوص پائیا (غذای سنتی).", 
    phonetic: "مِ انکانتا لا کومیدا اسپانیولا، اسپسیالمنته لا پاییا.",
    question: "معنی 'comida' چیست؟", 
    options: ["نوشیدنی", "غذا", "میوه", "شیرینی"], 
    correct: 1 
  },
  { 
    id: 25, 
    text: "¿Dónde está la estación de metro más cercana?", 
    meaning: "ایستگاه متروی نزدیک کجاست؟", 
    phonetic: "دونده استا لا استاسیون دِ مترو ماس سرکانو؟",
    question: "معنی 'estación de metro' چیست؟", 
    options: ["فرودگاه", "ایستگاه مترو", "هتل", "بیمارستان"], 
    correct: 1 
  },
  { 
    id: 26, 
    text: "Estoy buscando یک داروخانه برای خرید دارو.", 
    meaning: "من به دنبال یک داروخانه برای خرید دارو هستم.", 
    phonetic: "استوی بوسکاندو اونا فارماسیا پارا کومپر مدسینا.",
    question: "معنی 'farmacia' چیست؟", 
    options: ["داروخانه", "سوپرمارکت", "رستوران", "کتابفروشی"], 
    correct: 0 
  },
  { 
    id: 27, 
    text: "El agua está muy fría, pero el clima es agradable.", 
    meaning: "آب خیلی سرد است، اما آب و هوا دلپذیر است.", 
    phonetic: "ال آگوا است موئی فرییا، پرو ال کلیما است آگرادابل.",
    question: "کلمه 'fría' به چه معناست؟", 
    options: ["گرم", "سرد", "شیرین", "تلخ"], 
    correct: 1 
  },
  { 
    id: 28, 
    text: "Muchas gracias por todo. ¡Eres بسیار مهربان!", 
    meaning: "برای همه چیز خیلی ممنون. تو بسیار مهربان هستی!", 
    phonetic: "موچاس گراسیاس پور تودو. اِرِس موئی آمابه!",
    question: "معنی کلمه 'amable' چیست؟", 
    options: ["عصبانی", "مهربان / خوش‌برخورد", "غمگین", "تنبل"], 
    correct: 1 
  },
  { 
    id: 29, 
    text: "¡Felعات! Has completado las lecciones básicas de español.", 
    meaning: "تبریک می‌گویم! شما درس‌های پایه اسپانیایی را به اتمام رساندید.", 
    phonetic: "فلیچیدادس! آس کومپلتادو لاس لسیونس باسیکاس دِ اسپانیول.",
    question: "معنی کلمه 'Felicitaciones' چیست؟", 
    options: ["تسلیت", "تبریک", "خداحافظی", "خوش آمدید"], 
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
  let welcomeText = "سلام! به ربات آموزش اسپانیایی خوش آمدید.";

  if (lastLesson > 0) {
    welcomeText += `\n\nشما آخرین بار در **درس ${lastLesson + 1}** از مجموع ${lessons.length} درس بودید. مایلید از کجا ادامه دهید؟`;
    keyboard = [
      [{ text: `▶️ ادامه از آخرین درس (درس ${lastLesson + 1})`, callback_data: `lesson_${lastLesson}` }],
      [{ text: "🔄 شروع از درس اول (درس ۱)", callback_data: "lesson_0" }],
      [{ text: "📊 تعیین سطح", callback_data: "placement_test" }]
    ];
  } else {
    welcomeText += `\n\nبرای شروع یادگیری روی دکمه زیر بزنید (این دوره شامل ${lessons.length} درس جامع است):`;
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
