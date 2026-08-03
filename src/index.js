const lessons = [
  {
    id: 0,
    text: "Hola, ¿cómo estás? Estoy muy bien, gracias.",
    meaning: "سلام، چطور هستی؟ من خیلی خوبم، ممنون.",
    questions: [
      { q: "معنی کلمه 'Hola' چیست؟", options: ["سلام", "خداحافظ", "چطوری"], correct: 0 }
    ]
  }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is active");
    try {
      const update = await request.json();
      const token = env.Spanishtoken;

      if (update.message?.text === "/start") {
        await handleStart(token, update.message.chat.id);
      } else if (update.callback_query) {
        await handleCallback(token, update.callback_query);
      }
    } catch (err) {
      console.error("Worker Error:", err);
    }
    return new Response("OK");
  }
};

async function handleStart(token, chatId) {
  const lesson = lessons[0];
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: `📖 **درس اول:**\n\n${lesson.text}`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "👁 نمایش معنی", callback_data: "show_meaning_0" }],
        [{ text: "📝 شروع سوالات", callback_data: "start_quiz_0" }]
      ]
    }
  });
}

async function handleCallback(token, q) {
  const [action, type, index] = q.data.split("_");
  const lesson = lessons[parseInt(index)];

  if (action === "show_meaning") {
    await telegramFetch(token, "editMessageText", {
      chat_id: q.message.chat.id,
      message_id: q.message.message_id,
      text: `📖 **درس اول:**\n\n${lesson.text}\n\n💡 **معنی:**\n${lesson.meaning}`,
      reply_markup: {
        inline_keyboard: [[{ text: "📝 شروع سوالات", callback_data: `start_quiz_${index}` }]]
      }
    });
  } else if (action === "start_quiz") {
    const qData = lesson.questions[0];
    await telegramFetch(token, "sendMessage", {
      chat_id: q.message.chat.id,
      text: qData.q,
      reply_markup: {
        inline_keyboard: [
          qData.options.map((opt, i) => ({
            text: opt,
            callback_data: `answer_${i}_${qData.correct}`
          }))
        ]
      }
    });
  } else if (action === "answer") {
    const [_, selected, correct] = q.data.split("_");
    const resultText = selected === correct ? "✅ آفرین! درست بود." : "❌ اشتباه بود، دوباره تلاش کن.";
    await telegramFetch(token, "sendMessage", { chat_id: q.message.chat.id, text: resultText });
  }

  await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
}

async function telegramFetch(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
  return data;
}
