// سوالات را برای تست، تعدادشان را بیشتر کردم تا راحت به سطح hard برسی
const easyQuestions = [
  { text: "۱. سلام به اسپانیایی؟", options: ["Hola", "Adiós"], correct: 0 },
  { text: "۲. صبح بخیر؟", options: ["Buenas noches", "Buenos días"], correct: 1 },
  { text: "۳. ممنون؟", options: ["Gracias", "De nada"], correct: 0 }
];

const hardQuestions = [
  { text: "۴. فعل 'بودن' برای 'ما' (ما هستیم)؟", options: ["Somos", "Sois"], correct: 0 },
  { text: "۵. معنی 'Ir'؟", options: ["رفتن", "خوردن"], correct: 0 }
];

// حتماً توکن جدید را اینجا بگذار
const BOT_TOKEN = "8839168525:AAFKVI5cFYTiOLuhIMUQtEzBhDG5n24ykU0";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("OK");
    const update = await request.json();

    if (update.message?.text === "/start") {
      await sendQuestion(update.message.chat.id, 0, 0, "easy");
    }

    if (update.callback_query) {
      const q = update.callback_query;
      const [action, index, score] = q.data.split("_");
      const s = parseInt(score);
      const i = parseInt(index);

      // جلوگیری از لودینگ بی‌نهایت
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: q.id, text: action === "wrong" ? "❌ اشتباه بود!" : "✅ درست بود!", show_alert: action === "wrong" })
      });

      if (action === "correct") {
        const nextScore = s + 1;
        const nextIndex = i + 1;
        const level = (nextScore >= 2) ? "hard" : "easy"; // برای تست، سطح را روی 2 گذاشتم
        const list = (level === "hard") ? hardQuestions : easyQuestions;

        if (nextIndex < list.length) {
          await sendQuestion(q.message.chat.id, nextIndex, nextScore, level);
        } else {
          await sendMessage(q.message.chat.id, `🎉 تمام شد! امتیاز نهایی: ${nextScore}`);
        }
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
            callback_data: (i === q.correct) ? `correct_${index}_${score}` : `wrong_${index}_${score}`
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
