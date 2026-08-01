export default {
  async fetch(request, env, ctx) {
    // برای دیباگ کردن: بررسی کنیم آیا درخواست POST هست یا نه
    if (request.method !== "POST") {
      return new Response("Bot is running! Send POST updates.");
    }

    try {
      const update = await request.json();
      
      // لاگ کردن دریافت پیام برای دیباگ
      console.log("Received update:", JSON.stringify(update));

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        if (text === "/start") {
          await sendMessage(env, chatId, "سلام! ربات فعال شد و پیام شما را دریافت کرد.");
        }
      }
      
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
    }
  },
};

async function sendMessage(env, chatId, text) {
  const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"; // توکن را اینجا جایگزین کن
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });
}
