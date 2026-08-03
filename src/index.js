export default {
  async fetch(request, env, ctx) {
    console.log("ENV keys:", Object.keys(env || {}));
    console.log("Spanishtoken exists:", !!env?.Spanishtoken);

    if (request.method !== "POST") {
      return new Response("Bot is active");
    }

    try {
      const update = await request.json();

      console.log("Telegram update received:", JSON.stringify(update));

      const token = env?.Spanishtoken;

      if (!token) {
        console.error("Spanishtoken NOT FOUND");
        return new Response("Token not found", { status: 500 });
      }

      // دستور /start
      if (update.message?.text === "/start") {
        const chatId = update.message.chat.id;

        const telegramUrl =
          `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await fetch(telegramUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🇪🇸 سلام! ربات اسپانیایی فعال است."
          })
        });

        const result = await response.text();

        console.log("Telegram response:", result);

        if (!response.ok) {
          throw new Error("Telegram API Error: " + result);
        }
      }

      return new Response("OK");

    } catch (err) {
      console.error("Worker Error:", err);

      return new Response(
        "Error: " + (err?.message || String(err)),
        { status: 500 }
      );
    }
  }
};
