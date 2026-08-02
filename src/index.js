const questions = [
  { text: "۱. 'سلام' به اسپانیایی چی میشه؟", options: ["Hola", "Adiós"], correct: 0 },
  { text: "۲. 'صبح بخیر' به اسپانیایی چی میشه؟", options: ["Buenas noches", "Buenos días"], correct: 1 },
  { text: "۳. معنی '¿Cómo estás?' چیه؟", options: ["چطوری؟", "خداحافظ"], correct: 0 },
  { text: "۴. چطور می‌گوییم 'اسم من... است'؟", options: ["Me llamo...", "Tengo..."], correct: 0 }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

    // شروع بازی: ارسال سوال اول (اندیس ۰) با امتیاز ۰
    if (update.message?.text === "/start") {
      await sendQuestion(BOT_TOKEN, update.message.chat.id, 0, 0);
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const data = query.data; // فرمت: "correct_NextIndex_Score" یا "wrong"

      if (data === "wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ اشتباه بود!", show_alert: true })
        });
        return new Response("OK");
      }

      // اگر جواب درست بود
      if (data.startsWith("correct_")) {
        const [_, nextIndex, newScore] = data.split("_");
        const idx = parseInt(nextIndex);
        const score = parseInt(newScore);

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id })
        });

        // آیا سوال بعدی هست؟
        if (idx < questions.length) {
          await sendQuestion(BOT_TOKEN, query.message.chat.id, idx, score);
        } else {
          // پایان تست
          await sendMessage(BOT_TOKEN, query.message.chat.id, `🎉 تموم شد!\nامتیاز نهایی: ${score} از ${questions.length}`);
        }
      }
    }
    return new Response("OK");
  }
};

// تابع ارسال سوال
async function sendQuestion(token, chatId, index, currentScore) {
  const q = questions[index];
  const buttons = q.options.map((opt, i) => {
    // اگر درسته، به سوال بعدی میره (index + 1)
    const isCorrect = (i === q.correct);
    return [{ 
      text: opt, 
      callback_data: isCorrect ? `correct_${index + 1}_${currentScore + 1}` : "wrong" 
    }];
  });

  await sendMessage(token, chatId, q.text, { inline_keyboard: buttons });
}

async function sendMessage(token, chatId, text, reply_markup = null) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup })
  });
}
