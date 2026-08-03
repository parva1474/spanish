const lessons = [
  { id: 0, text: "Hola, ¿cómo estás?", meaning: "سلام، چطور هستی؟", questions: [{ q: "معنی Hola؟", options: ["سلام", "خداحافظ"], correct: 0 }] }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") return new Response("Bot is active");
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      if (update.message?.text === "/start") await handleStart(token, update.message.chat.id);
      else if (update.callback_query) await handleCallback(token, update.callback_query);
    } catch (err) { console.error("Error:", err); }
    return new Response("OK");
  }
};

async function handleStart(token, chatId) {
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: "سلام! به ربات آموزش اسپانیایی خوش آمدی. یکی را انتخاب کن:",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📖 شروع درس‌ها", callback_data: "start_lessons" }],
        [{ text: "📊 تعیین سطح", callback_data: "placement_test" }]
      ]
    }
  });
}

async function handleCallback(token, q) {
  const data = q.data;
  if (data === "start_lessons") {
    // نمایش درس اول
    await sendLesson(token, q.message.chat.id, 0);
  } else if (data === "placement_test") {
    // شروع سوال تعیین سطح
    await telegramFetch(token, "sendMessage", {
      chat_id: q.message.chat.id,
      text: "سوال تعیین سطح: کلمه 'Gracias' به چه معناست؟",
      reply_markup: {
        inline_keyboard: [[{ text: "ممنون", callback_data: "level_correct" }, { text: "سلام", callback_data: "level_wrong" }]]
      }
    });
  } else if (data === "level_correct" || data === "level_wrong") {
    const text = data === "level_correct" ? "عالی! سطح شما متوسط است." : "سطح شما مبتدی است.";
    await telegramFetch(token, "sendMessage", { chat_id: q.message.chat.id, text });
  }
  await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
}

async function sendLesson(token, chatId, id) {
  const lesson = lessons[id];
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: `📖 درس: ${lesson.text}`,
    reply_markup: { inline_keyboard: [[{ text: "👁 معنی", callback_data: "show_m" }]] }
  });
}

async function telegramFetch(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return await res.json();
}
