const questions = [
  { id: "q1", text: "۱. 'سلام' به اسپانیایی چی میشه؟", options: ["Hola", "Adiós"], correct: 0 },
  { id: "q2", text: "۲. 'صبح بخیر' به اسپانیایی چی میشه؟", options: ["Buenas noches", "Buenos días"], correct: 1 },
  { id: "q3", text: "۳. معنی '¿Cómo estás?' چیه؟", options: ["چطوری؟", "خداحافظ"], correct: 0 }, // سوال جدید
  { id: "q4", text: "۴. چطور می‌گوییم 'اسم من... است'؟", options: ["Me llamo...", "Tengo..."], correct: 0 }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

    // ۱. اگر استارت زد، سوال اول رو بفرست
    if (update.message?.text === "/start") {
      await sendQuestion(BOT_TOKEN, update.message.chat.id, questions[0], 0);
    }

    // ۲. مدیریت پاسخ‌ها
    if (update.callback_query) {
      const query = update.callback_query;
      const data = query.data; // فرمت: "qID_score"

      // حذف لودینگ
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: query.id })
      });

      if (data === "wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ اشتباه بود!", show_alert: true })
        });
        return;
      }

      // تحلیل داده‌ها
      const [qid, currentScore] = data.split("_");
      const score = parseInt(currentScore);
      const currentIndex = questions.findIndex(q => q.id === qid);

      // اگر سوال بعدی هست
      if (currentIndex < questions.length - 1) {
        const nextQ = questions[currentIndex + 1];
        await sendQuestion(BOT_TOKEN, query.message.chat.id, nextQ, score);
      } else {
        // پایان تست
        await sendBotMessage(BOT_TOKEN, query.message.chat.id, `🎉 تبریک! تست تمام شد.\nامتیاز نهایی: ${score} از ${questions.length}`);
      }
    }
    return new Response("OK");
  }
};

// تابع ارسال سوال
async function sendQuestion(token, chatId, qObj, currentScore) {
  const nextIndex = questions.findIndex(q => q.id === qObj.id) + 1;
  const nextQ = questions[nextIndex];
  
  // دکمه‌ها
  const buttons = qObj.options.map((opt, index) => {
    // اگر جواب درسته، بفرستش به سوال بعدی با امتیاز +1
    // اگر غلطه، بفرستش به "wrong"
    const nextData = (nextIndex < questions.length) ? `${nextQ.id}_${index === qObj.correct ? currentScore + 1 : currentScore}` : `finish_${index === qObj.correct ? currentScore + 1 : currentScore}`;
    return [{ text: opt, callback_data: index === qObj.correct ? nextData : "wrong" }];
  });

  await sendBotMessage(token, chatId, qObj.text, { inline_keyboard: buttons });
}

async function sendBotMessage(token, chatId, text, reply_markup = null) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup })
  });
}
