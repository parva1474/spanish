export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Hello!");

    const update = await request.json();
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      // نمونه کد برای خواندن از دیتابیس (مثلاً برای خوش‌آمدگویی یا سطح کاربر)
      if (text === "/start") {
        await env.DB.prepare("INSERT OR IGNORE INTO users (telegram_id) VALUES (?)").bind(chatId).run();
        await sendMessage(chatId, "سلام! به ربات آموزش زبان اسپانیایی خوش آمدید. ما از سطح A1 شروع می‌کنیم.");
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  },
};

async function sendMessage(chatId, text) {
  const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0"; // اینجا توکن رباتت را بگذار
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });
}
