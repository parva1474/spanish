const easyQuestions = [
  { text: "سلام به اسپانیایی؟", options: ["Hola", "Adiós"], correct: 0 },
  { text: "عدد ۵ به اسپانیایی؟", options: ["Cinco", "Tres"], correct: 0 }
];

const hardQuestions = [
  { text: "فعل 'بودن' برای 'ما'؟", options: ["Somos", "Sois"], correct: 0 },
  { text: "معنی 'Ir'؟", options: ["رفتن", "خوردن"], correct: 0 }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();
    const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

    if (update.message?.text === "/start") {
      await sendQuestion(BOT_TOKEN, update.message.chat.id, 0, 0, "easy");
    }

    if (update.callback_query) {
      const q = update.callback_query;
      const [type, index, score] = q.data.split("_");
      const s = parseInt(score);
      const i = parseInt(index);

      // تشخیص سطح فعلی
      let currentList = (s >= 10) ? hardQuestions : easyQuestions;

      if (type === "ans") {
        const isCorrect = (q.message.reply_markup.inline_keyboard[i][0].callback_data.includes("correct"));
        const newScore = isCorrect ? s + 1 : s;
        const nextIndex = i + 1;
        
        // ویرایش پیام (برای امتیاز لحظه‌ای)
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: q.message.chat.id,
            message_id: q.message.message_id,
            text: `امتیاز شما: ${newScore}\n\n${(newScore >= 10 ? "سطح سخت: " : "سطح آسان: ") + (currentList[nextIndex]?.text || "پایان")}`,
            reply_markup: await getMarkup(nextIndex, newScore, currentList)
          })
        });
      }
    }
    return new Response("OK");
  }
};

async function getMarkup(index, score, list) {
  if (index >= list.length) return null;
  const q = list[index];
  return {
    inline_keyboard: q.options.map((opt, i) => [{
      text: opt,
      callback_data: `ans_${index}_${score}_${i === q.correct ? "correct" : "wrong"}`
    }])
  };
}

async function sendQuestion(token, chatId, index, score, level) {
  const list = (level === "hard") ? hardQuestions : easyQuestions;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `امتیاز: ${score}\n\n${list[index].text}`,
      reply_markup: await getMarkup(index, score, list)
    })
  });
}
