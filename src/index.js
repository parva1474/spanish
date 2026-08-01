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

    if (update.message?.text === "/start") {
      await sendBotMessage(BOT_TOKEN, update.message.chat.id, "شروع تعیین سطح:", {
        inline_keyboard: [[{ text: "📝 شروع", callback_data: "q1_0" }]]
      });
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const data = query.data; // فرمت: qX_score یا finish_score یا wrong
      
      // ۱. اگر غلط بود
      if (data === "wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ اشتباه بود!", show_alert: true })
        });
        return new Response("OK");
      }

      // ۲. اگر تست تمام شد
      if (data.startsWith("finish_")) {
        const score = data.split("_")[1];
        await sendBotMessage(BOT_TOKEN, query.message.chat.id, `🎉 تبریک! تست تمام شد.\nامتیاز نهایی: ${score} از ${questions.length}`);
        return new Response("OK");
      }

      // ۳. اگر سوال بعدی وجود داشت
      const [qid, score] = data.split("_");
      const currentQ = questions.find(q => q.id === qid);
      
      if (currentQ) {
        const currentIndex = questions.indexOf(currentQ);
        const nextIndex = currentIndex + 1;
        
        // آیا سوال بعدی داریم؟
        if (nextIndex < questions.length) {
          const nextQ = questions[nextIndex];
          
          await sendBotMessage(BOT_TOKEN, query.message.chat.id, currentQ.text, {
            inline_keyboard: [
              [{ text: currentQ.options[0], callback_data: (currentQ.correct === 0 ? `${nextQ.id}_${parseInt(score) + 1}` : "wrong") }],
              [{ text: currentQ.options[1], callback_data: (currentQ.correct === 1 ? `${nextQ.id}_${parseInt(score) + 1}` : "wrong") }]
            ]
          });
        } 
        // این بخش برای سوال آخره (ق4)
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
