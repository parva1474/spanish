export default {
  async fetch(request, env, ctx) {
    // ۱. حتما باید متد POST باشه (چون تلگرام با POST پیام میفرسته)
    if (request.method !== "POST") return new Response("OK");

    const update = await request.json();
    
    // توکن را دقیقاً اینجا بنویس (مثلاً: "123456:ABC-DEF...")
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0"; 

    // --- مدیریت پیام‌های متنی (/start) ---
    if (update.message && update.message.text === "/start") {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: update.message.chat.id,
          text: "سلام! به ربات اسپانیایی خوش اومدی. برای تعیین سطح روی دکمه بزن:",
          reply_markup: {
            inline_keyboard: [[{ text: "📝 شروع تعیین سطح", callback_data: "placement_test" }]]
          }
        }),
      });
      return new Response("OK");
    }

    // --- مدیریت کلیک روی دکمه (Callback Query) ---
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;

      // ابتدا لودینگ دکمه رو بردار
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: query.id })
      });

      // و بعد پیام جدید رو بفرست
      if (query.data === "placement_test") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "خیلی خب، بریم سراغ سوال اول: 'سلام' به اسپانیایی چی میشه؟"
          }),
        });
      }
      return new Response("OK");
    }

    return new Response("OK");
  },
};
