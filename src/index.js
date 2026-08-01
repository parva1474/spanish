export default {
  async fetch(request, env, ctx) {
    // ۱. اگر متد درخواست POST نباشد، پاسخ اولیه بده
    if (request.method !== "POST") {
      return new Response("Bot is active and listening.");
    }

    try {
      // ۲. دریافت اطلاعات از تلگرام
      const update = await request.json();
      
      // ۳. بررسی اینکه پیام وجود دارد
      if (!update.message || !update.message.text) {
        return new Response("OK");
      }

      const chatId = update.message.chat.id;
      const text = update.message.text;

      // ۴. توکن خودت را اینجا مستقیماً کپی کن (برای تست نهایی)
      // اگر با این کار ربات جواب داد، یعنی مشکل از بخش Variable کلودفلر بوده
      const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

      // ۵. ارسال پاسخ به تلگرام
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `سلام! ربات متصل است. شما گفتید: ${text}`
        }),
      });

      return new Response("OK");
    } catch (err) {
      return new Response("Error: " + err.message);
    }
  },
};
