export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is active.");

    const update = await request.json();
    
    // توکن را اینجا جایگذاری کن (هرچند بعدا حتما توی Secrets بذارش که امن بمونه)
    const BOT_TOKEN = "TOKEN_RA_INJA_GZAR"; 

    // ۱. هندل کردن پیام‌های متنی (مثل /start)
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === "/start") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "سلام! به ربات آموزش اسپانیایی خوش آمدی. برای شروع، لطفا دکمه زیر را بزن:",
            reply_markup: {
              inline_keyboard: [
                [{ text: "📝 شروع تعیین سطح", callback_data: "placement_test" }]
              ]
            }
          }),
        });
      }
    }

    // ۲. هندل کردنِ زدنِ دکمه (Callback Query)
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      if (data === "placement_test") {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "بسیار عالی! بیا سطح زبانت رو با چند سوال کوتاه بسنجیم. آماده‌ای؟"
          }),
        });
      }
    }

    return new Response("OK");
  },
};
