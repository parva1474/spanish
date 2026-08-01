export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");

    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0"; 

    // برای سادگی در این مرحله، ما امتیاز رو در callback_data می‌فرستیم
    // فرمت: "q[شماره سوال]_[امتیاز فعلی]"
    
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const data = query.data; // مثال: "q1_0" یا "q2_1"

      // ۱. شروع تست
      if (data === "start_test") {
        await sendQuestion(BOT_TOKEN, chatId, "q1", 0, "سوال ۱: 'سلام' به اسپانیایی چیست؟", ["Hola", "Adios"], "q1_correct");
      }

      // ۲. پردازش جواب درست
      else if (data.startsWith("q") && data.endsWith("_correct")) {
        const parts = data.split("_");
        const nextQ = parseInt(parts[0].replace("q", "")) + 1;
        const currentScore = parseInt(parts[2]) + 1;

        if (nextQ === 2) {
          await sendQuestion(BOT_TOKEN, chatId, "q2", currentScore, "سوال ۲: 'خداحافظ' چیست؟", ["Adios", "Hola"], "q2_correct");
        } else {
          // پایان تست
          await sendMessage(BOT_TOKEN, chatId, `تموم شد! امتیاز شما: ${currentScore} از ۲. سطح شما: ${currentScore >= 2 ? "خوب" : "مبتدی"}`);
        }
      }
      
      // ۳. پردازش جواب غلط
      else if (data.includes("_wrong")) {
         await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ اشتباه بود!", show_alert: true })
        });
      }
    } else if (update.message?.text === "/start") {
       await sendMessage(BOT_TOKEN, update.message.chat.id, "برای شروع تعیین سطح بزن روی دکمه:", {
         inline_keyboard: [[{ text: "📝 شروع", callback_data: "start_test" }]]
       });
    }

    return new Response("OK");
  },
};

// توابع کمکی برای تمیزتر شدن کد
async function sendMessage(token, chatId, text, reply_markup = null) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup })
  });
}

async function sendQuestion(token, chatId, qId, score, text, options, correctData) {
  await sendMessage(token, chatId, text, {
    inline_keyboard: [
      [{ text: options[0], callback_data: `${qId}_correct_${score}` }],
      [{ text: options[1], callback_data: `${qId}_wrong_${score}` }]
    ]
  });
}
