export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

    if (update.message?.text === "/start") {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: update.message.chat.id,
          text: "سلام! بزن روی شروع:",
          reply_markup: { inline_keyboard: [[{ text: "📝 شروع", callback_data: "q1" }]] }
        })
      });
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const data = query.data;

      // پاسخ به دکمه (حذف لودینگ)
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: query.id })
      });

      // منطق سوالات
      if (data === "q1") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سوال ۱: سلام به اسپانیایی؟",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Hola", callback_data: "q2" }],
                [{ text: "Adios", callback_data: "wrong" }]
              ]
            }
          })
        });
      } 
      else if (data === "q2") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سوال ۲: خداحافظ به اسپانیایی؟",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Adios", callback_data: "finish" }],
                [{ text: "Hola", callback_data: "wrong" }]
              ]
            }
          })
        });
      }
      else if (data === "finish") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "تبریک! تموم شد." })
        });
      }
      else if (data === "wrong") {
        // این بخش همون پاپ‌آپه که قبلاً کار می‌کرد
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ اشتباه بود!", show_alert: true })
        });
      }
    }
    return new Response("OK");
  }
};
