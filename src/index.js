const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

export default {
  async fetch(request, env, ctx) {
    try {
      const update = await request.json();
      
      // فقط یک پاسخ ساده برای اینکه بفهمیم سیستم وصل است
      const chatId = update.message?.chat.id || update.callback_query?.message.chat.id;
      
      if (chatId) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: chatId, 
            text: "✅ ربات وصل شد! سیستم در حال کار است." 
          })
        });
      }
      return new Response("OK");
    } catch (e) {
      return new Response("Error: " + e.message);
    }
  }
};
