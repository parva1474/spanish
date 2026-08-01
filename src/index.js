export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Spanish Bot is running.");

    const update = await request.json();
    if (!update.message) return new Response("OK");

    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    // فقط دستورات ربات اسپانیایی
    if (text === "/start") {
      await sendMessage(env, chatId, "سلام! به ربات آموزش زبان اسپانیایی خوش آمدید. ما از سطح A1 شروع می‌کنیم.");
    } else {
      await sendMessage(env, chatId, "شما گفتید: " + text + ". فعلاً این بخش در حال توسعه است!");
    }
    
    return new Response(JSON.stringify({ ok: true }));
  },
};

async function sendMessage(env, chatId, text) {
  // اینجا توکن ربات Spanish را در Secrets (بخش Variables در کلودفلر) با نام BOT_TOKEN ذخیره کن
  const BOT_TOKEN = env.BOT_TOKEN; 
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });
}
