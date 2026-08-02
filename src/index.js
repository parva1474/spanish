const easyQuestions = [
  { text: "۱. سلام به اسپانیایی؟", options: ["Hola", "Adiós"], correct: 0 },
  { text: "۲. صبح بخیر؟", options: ["Buenas noches", "Buenos días"], correct: 1 },
  { text: "۳. ممنون؟", options: ["Gracias", "De nada"], correct: 0 },
  { text: "۴. اسم من...؟", options: ["Me llamo...", "Tengo..."], correct: 0 },
  { text: "۵. خداحافظ؟", options: ["Adiós", "Hola"], correct: 0 }
];

const hardQuestions = [
  { text: "۶. فعل بودن (ما هستیم)؟", options: ["Somos", "Sois"], correct: 0 },
  { text: "۷. معنی Ir؟", options: ["رفتن", "خوردن"], correct: 0 },
  { text: "۸. قرمز؟", options: ["Rojo", "Azul"], correct: 0 },
  { text: "۹. مدرسه؟", options: ["Casa", "Escuela"], correct: 1 },
  { text: "۱۰. عدد ۵؟", options: ["Tres", "Cinco"], correct: 1 }
];

// حتماً توکن جدید را اینجا بگذار (بعد از باطل کردن توکن قبلی)
const BOT_TOKEN = "TOKEN_جدید";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();

    if (update.message?.text === "/start") {
      await sendQuestion(update.message.chat.id, 0, 0, "easy");
    }

    if (update.callback_query) {
      const q = update.callback_query;
      const [action, index, score, level] = q.data.split("_");
      const s = parseInt(score);
      const i = parseInt(index);

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: q.id })
      });

      if (action === "correct") {
        const nextScore = s + 1;
        let nextIndex = i + 1;
        let nextLevel = level;

        // منطق تغییر سطح
        if (level === "easy" && nextScore >= 3) {
            nextLevel = "hard";
            nextIndex = 0; // ریست کردن سوالات از اول برای سطح سخت
        }

        const list = (nextLevel === "hard") ? hardQuestions : easyQuestions;

        if (nextIndex < list.length) {
          await sendQuestion(q.message.chat.id, nextIndex, nextScore, nextLevel);
        } else {
          await sendMessage(q.message.chat.id, `🎉 تموم شد! سطح: ${level}\nامتیاز نهایی: ${nextScore}`);
        }
      } else {
        await sendMessage(q.message.chat.id, "❌ غلط بود! دوباره فکر کن.");
      }
    }
    return new Response("OK");
  }
};

async function sendQuestion(chatId, index, score, level) {
  const list = (level === "hard") ? hardQuestions : easyQuestions;
  const q = list[index];

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `امتیاز: ${score} | سطح: ${level}\n\n${q.text}`,
      reply_markup: {
        inline_keyboard: [
          q.options.map((opt, i) => ({
            text: opt,
            callback_data: (i === q.correct) ? `correct_${index}_${score}_${level}` : `wrong_${index}_${score}_${level}`
          }))
        ]
      }
    })
  });
}

async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
