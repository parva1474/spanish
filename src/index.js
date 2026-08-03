export default {
  async fetch(request, env, ctx) {
    // خط دیباگ: این خط را به لاگ‌های کلودفلر می‌فرستد
    console.log("All ENV keys:", Object.keys(env)); 
    console.log("Is Spanishtoken present?", !!env.Spanishtoken);

    if (request.method !== "POST") return new Response("Bot is active");
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      
console.log("env =", env);
console.log("keys =", Object.keys(env || {}));
      
      if (!token) {
        throw new Error("توکن تلگرام در env پیدا نشد. کلیدها این‌ها هستند: " + Object.keys(env));
      }
      
      // ... ادامه کدهای قبلی
      if (update.message?.text === "/start") {
        await handleStart(token, update.message.chat.id);
      } else if (update.callback_query) {
        await handleCallback(token, update.callback_query);
      }
    } catch (err) {
      console.error("Worker Error:", err);
      return new Response("Error: " + err.message, { status: 500 });
    }
    return new Response("OK");
  }
};
// ... بقیه توابع (handleStart, handleCallback, telegramFetch) را دست نزن
