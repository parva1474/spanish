export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");

    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0"; 

    // --- مدیریت پیام‌های متنی ---
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === "/start") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سلام! به ربات اسپانیایی خوش اومدی. برای تعیین سطح روی دکمه بزن:",
            reply_markup: {
              inline_keyboard: [[{ text: "📝 شروع تعیین سطح", callback_data: "placement_test" }]]
            }
          }),
        });
      } else {
        // اینجا بعداً جواب‌های کاربر به سوالات رو چک می‌کنیم
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "پیام شما دریافت شد: " + text })
        });
      }
    }

    // --- مدیریت دکمه ---
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: query.id })
      });

      if (query.data === "placement_test") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "بریم سراغ سوال اول:\n'سلام' به اسپانیایی چی میشه؟\n۱. Hola\n۲. Adios\n۳. Gracias"
          }),
        });
      }
    }

    return new Response("OK");
  },
};
