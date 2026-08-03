export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is active");

    try {
      const update = await request.json();
      const token = env.Spanishtoken; // استفاده از Secret دقیق شما

      if (update.message?.text === "/start") {
        const userId = update.message.from.id;
        await handleStart(token, env.DB, userId, update.message.chat.id);
      }

      if (update.callback_query) {
        await handleCallback(token, env.DB, update.callback_query);
      }

    } catch (err) {
      console.error("Worker Error:", err);
    }
    return new Response("OK");
  }
};

async function handleStart(token, db, userId, chatId) {
  // در آینده اینجا منطق درس اول را اضافه می‌کنیم
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: "🌟 به ربات آموزش اسپانیایی خوش آمدید! به زودی اولین درس را شروع می‌کنیم."
  });
}

async function handleCallback(token, db, q) {
  // منطق دکمه‌ها (بعد از اینکه محتوای آموزشی را اضافه کردیم، اینجا تکمیل می‌شود)
  await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
}

async function telegramFetch(token, method, body) {
  if (!token) throw new Error("توکن تلگرام پیدا نشد.");

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`);
  }
  return data;
}
