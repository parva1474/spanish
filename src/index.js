const easy = ["سلام؟", "۵؟"]; // سوالات ساده
const hard = ["فعل بودن؟", "معنی Ir؟"]; // سوالات سخت

export default {
  async fetch(request, env, ctx) {
    try {
      const data = await request.json();
      const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";
      
      console.log("دریافت شد:", JSON.stringify(data)); // لاگ برای عیب‌یابی

      if (data.message?.text === "/start") {
        await send(BOT_TOKEN, data.message.chat.id, 0, 0);
      } 
      else if (data.callback_query) {
        const [_, idx, score] = data.callback_query.data.split("_");
        const nextIdx = parseInt(idx) + 1;
        const newScore = parseInt(score) + 1;
        
        await send(BOT_TOKEN, data.callback_query.message.chat.id, nextIdx, newScore);
      }
      return new Response("OK");
    } catch (e) {
      console.error("خطا:", e.message); // اگر جایی گیر کرد اینجا می‌نویسد
      return new Response("Error: " + e.message);
    }
  }
};

async function send(token, chatId, idx, score) {
  const list = (score >= 10) ? hard : easy;
  if (idx >= list.length) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: `پایان! امتیاز نهایی: ${score}` })
    });
    return;
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `امتیاز: ${score}\n${list[idx]}`,
      reply_markup: {
        inline_keyboard: [[
          { text: "درست", callback_data: `ans_${idx}_${score}` },
          { text: "غلط", callback_data: "fail" }
        ]]
      }
    })
  });
}
