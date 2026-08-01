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
          text: "سلام! به ربات اسپانیایی خوش اومدی. شروع کنیم؟",
          reply_markup: {
            inline_keyboard: [[{ text: "📝 شروع تعیین سطح", callback_data: "q1" }]]
          }
        }),
      });
    }

    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const data = query.data;

      // سوال اول
      if (data === "q1") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سوال ۱: 'سلام' به اسپانیایی چی میشه؟",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Hola", callback_data: "q1_correct" }],
                [{ text: "Adios", callback_data: "q1_wrong" }]
              ]
            }
          }),
        });
      }
      // درست بودن سوال اول -> رفتن به سوال دوم
      else if (data === "q1_correct") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "آفرین! درست بود. حالا سوال ۲: 'خداحافظ' چی میشه؟",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Adios", callback_data: "q2_correct" }],
                [{ text: "Hola", callback_data: "q2_wrong" }]
              ]
            }
          }),
        });
      }
      // جواب غلط
      else if (data === "q1_wrong" || data === "q2_wrong") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id, text: "❌ غلط بود، دوباره سعی کن!", show_alert: true })
        });
        return new Response("OK");
      }
      // پایان تعیین سطح
      else if (data === "q2_correct") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "تبریک! تعیین سطح تمام شد. سطح شما: مبتدی" })
        });
      }
    }

    return new Response("OK");
  },
};
