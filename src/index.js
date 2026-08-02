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

    if (update.message?.text === "/start") {
      await sendQuestion(BOT_TOKEN, update.message.chat.id, 0, 0);
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const data = query.data;

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
        return new Response("OK");
      }

      const [_, nextIndex, score] = data.split("_");
      const idx = parseInt(nextIndex);
      const currentScore = parseInt(score);

      // اگر idx برابر با طول سوالات باشه، یعنی تست تموم شده
      if (idx >= questions.length) {
        await sendMessage(BOT_TOKEN, query.message.chat.id, `🎉 تبریک! تست تمام شد.\nامتیاز نهایی: ${currentScore} از ${questions.length}`);
      } else {
        await sendQuestion(BOT_TOKEN, query.message.chat.id, idx, currentScore);
      }
    }
    return new Response("OK");
  }
};

async function sendQuestion(token, chatId, index, currentScore) {
  const q = questions[index];
  const buttons = q.options.map((opt, i) => {
    const isCorrect = (i === q.correct);
    // دکمه بعدی همیشه شماره سوال بعدی رو میده (index + 1)
    return [{ 
      text: opt, 
      callback_data: isCorrect ? `next_${index + 1}_${currentScore + 1}` : "wrong" 
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
