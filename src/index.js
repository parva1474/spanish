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

    // شروع بازی
    if (update.message?.text === "/start") {
      await sendBotMessage(BOT_TOKEN, update.message.chat.id, "شروع تست:", {
        inline_keyboard: [[{ text: "📝 شروع", callback_data: "q1_0" }]] // امتیاز اولیه 0
      });
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const [qid, score] = query.data.split("_"); // جدا کردن شماره سوال و امتیاز

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: query.id })
      });

      // پردازش جواب غلط
      if (query.data === "wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ غلط بود!", show_alert: true })
        });
        return new Response("OK");
      }

      // پیدا کردن سوال فعلی
      const currentQ = questions.find(q => q.id === qid);
      
      if (currentQ) {
        const nextIndex = questions.indexOf(currentQ) + 1;
        
        // اگر هنوز سوالی مونده
        if (nextIndex < questions.length) {
          const nextQ = questions[nextIndex];
          
          await sendBotMessage(BOT_TOKEN, query.message.chat.id, currentQ.text, {
            inline_keyboard: [
              // اگر درست بود: امتیاز رو +1 کن
              [{ text: currentQ.options[0], callback_data: (currentQ.correct === 0 ? `${nextQ.id}_${parseInt(score) + 1}` : "wrong") }],
              [{ text: currentQ.options[1], callback_data: (currentQ.correct === 1 ? `${nextQ.id}_${parseInt(score) + 1}` : "wrong") }]
            ]
          });
        } 
        // اگر تست تموم شد (آخرین سوال)
        else {
          const finalScore = (currentQ.correct === 0) ? (parseInt(score) + 1) : parseInt(score);
          await sendBotMessage(BOT_TOKEN, query.message.chat.id, `🎉 تبریک! تست تمام شد.\nامتیاز نهایی: ${finalScore} از ${questions.length}`);
        }
      }
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
