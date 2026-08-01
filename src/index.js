export default {
  async fetch(request, env, ctx) {
    const update = await request.json();
    const chatId = update.message?.chat.id;
    
    if (chatId) {
      await fetch(`https://api.telegram.org/bot${env.spanishtoken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: "دریافت شد!" }),
      });
    }

    return new Response("OK");
  },
};
