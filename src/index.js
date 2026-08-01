export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is running.");

    const update = await request.json();
    if (!update.message) return new Response("OK");

    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    // ۱. اولویت اول: هندل کردن دستورات (commands)
    if (text === "/start") {
      await sendMessage(env, chatId, "سلام! خوش آمدی به ربات اسپانیایی. من آماده‌ام تا از A1 تا C2 بهت آموزش بدم.");
      return new Response("OK");
    }

    // ۲. اولویت دوم: اگر دستور نبود، پیام عادیه (اینجا کدهای قبلی رو پاک کن که دیگه شرح در متن نده!)
    await sendMessage(env, chatId, "من این پیام شما رو دریافت کردم: " + text);
    
    return new Response(JSON.stringify({ ok: true }));
  },
};

async function sendMessage(env, chatId, text) {
  const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });
}
