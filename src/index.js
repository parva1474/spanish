export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");

    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0"; 

    // --- مدیریت پیام‌های متنی ---
    if (update.message) {
      const chatId = update.message.chat.id;
      if (update.message.text === "/start") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سلام! برای تعیین سطح دکمه زیر را بزن:",
            reply_markup: {
              inline_keyboard: [[{ text: "📝 شروع تعیین سطح", callback_data: "placement_test" }]]
            }
          }),
        });
      }
    }

    // --- مدیریت دکمه‌ها ---
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const data = query.data;

      // ۱. اگر روی شروع کلیک کرد
      if (data === "placement_test") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id })
        });
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سوال اول: 'سلام' به اسپانیایی چی میشه؟",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Hola", callback_data: "ans_correct" }],
                [{ text: "Adios", callback_data: "ans_wrong" }],
                [{ text: "Gracias", callback_data: "ans_wrong" }]
              ]
            }
          }),
        });
      } 
      // ۲. اگر جواب درست رو زد
      else if (data === "ans_correct") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            callback_query_id: query.id, 
            text: "✅ آفرین! درست بود.", 
            show_alert: true 
          })
        });
      }
      // ۳. اگر جواب غلط رو زد
      else if (data === "ans_wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            callback_query_id: query.id, 
            text: "❌ اشتباه بود! دوباره امتحان کن.", 
            show_alert: true 
          })
        });
      }
    }

    return new Response("OK");
  },
};
