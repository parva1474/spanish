const lessons = [
  { id: 0, text: "Hola, ¿cómo estás?", meaning: "سلام، چطور هستی؟", questions: [{ q: "معنی Hola؟", options: ["سلام", "خداحافظ"], correct: 0 }] }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Bot is active");
    }
    
    try {
      const update = await request.json();
      const token = env.Spanishtoken;
      
      if (!token) {
        console.error("Token is missing in environment variables!");
        return new Response("OK");
      }

      // بررسی پیام متنی (مثل /start)
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        
        if (text === "/start" || text.startsWith("/start")) {
          await handleStart(token, chatId);
        } else {
          await telegramFetch(token, "sendMessage", {
            chat_id: chatId,
            text: "لطفاً از دکمه‌های منو یا دستور /start استفاده کنید."
          });
        }
      } 
      // بررسی کلیک روی دکمه‌ها (Callback Query)
      else if (update.callback_query) {
        await handleCallback(token, update.callback_query);
      }
      
    } catch (err) {
      console.error("Error processing update:", err);
    }
    
    return new Response("OK");
  }
};

async function handleStart(token, chatId) {
  await telegramFetch(token, "sendMessage", {
    chat_id: chatId,
    text: "سلام! به ربات آموزش اسپانیایی خوش آمدید. لطفاً یکی را انتخاب کنید:",
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
  const chatId = q.message.chat.id;
  
  if (data === "start_lessons") {
    const lesson = lessons[0];
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `📖 درس: ${lesson.text}`,
      reply_markup: { 
        inline_keyboard: [[{ text: "👁 نمایش معنی", callback_data: "show_meaning" }]] 
      }
    });
  } else if (data === "show_meaning") {
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: `معنی: ${lessons[0].meaning}`
    });
  } else if (data === "placement_test") {
    await telegramFetch(token, "sendMessage", {
      chat_id: chatId,
      text: "سوال تعیین سطح: کلمه 'Gracias' به چه معناست؟",
      reply_markup: {
        inline_keyboard: [
          [{ text: "ممنون", callback_data: "level_correct" }, { text: "سلام", callback_data: "level_wrong" }]
        ]
      }
    });
  } else if (data === "level_correct" || data === "level_wrong") {
    const text = data === "level_correct" ? "عالی! سطح شما متوسط است." : "سطح شما مبتدی است.";
    await telegramFetch(token, "sendMessage", { chat_id: chatId, text });
  }
  
  await telegramFetch(token, "answerCallbackQuery", { callback_query_id: q.id });
}

async function telegramFetch(token, method, body) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    console.error("Telegram API Error:", e);
  }
}
