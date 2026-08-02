const easy = ["سلام؟", "۵؟"];
const hard = ["فعل بودن؟", "معنی Ir؟"];

export default {
  async fetch(request, env, ctx) {
    try {
      const data = await request.json();

      // توکن از Secret کلودفلر خوانده می‌شود
      const BOT_TOKEN = env.Spanishtoken;

      console.log("دریافت شد:", JSON.stringify(data));

      // شروع بازی
      if (data.message?.text === "/start") {
        await sendQuestion(
          BOT_TOKEN,
          data.message.chat.id,
          0,
          0
        );
      }

      // کلیک روی دکمه‌ها
      else if (data.callback_query) {
        const callback = data.callback_query;

        // برداشتن حالت Loading دکمه
        await answerCallback(
          BOT_TOKEN,
          callback.id
        );

        const parts = callback.data.split("_");

        const action = parts[0];
        const idx = parseInt(parts[1]);
        const score = parseInt(parts[2]);

        let newScore = score;

        // فقط جواب درست امتیاز می‌دهد
        if (action === "correct") {
          newScore = score + 1;
        }

        // رفتن به سؤال بعدی
        const nextIdx = idx + 1;

        await sendQuestion(
          BOT_TOKEN,
          callback.message.chat.id,
          nextIdx,
          newScore
        );
      }

      return new Response("OK");

    } catch (e) {
      console.error("خطا:", e);

      return new Response(
        "Error: " + e.message,
        { status: 500 }
      );
    }
  }
};


// ============================
// ارسال سؤال
// ============================

async function sendQuestion(token, chatId, idx, score) {

  // سؤال‌های ساده
  if (idx < easy.length) {

    await sendMessage(token, chatId, {
      text:
        `🟢 سؤال ساده\n\n` +
        `امتیاز: ${score}\n\n` +
        `${easy[idx]}`,

      reply_markup: {
        inline_keyboard: [[
          {
            text: "✅ درست",
            callback_data: `correct_${idx}_${score}`
          },
          {
            text: "❌ غلط",
            callback_data: `wrong_${idx}_${score}`
          }
        ]]
      }
    });

    return;
  }


  // سؤال‌های سخت
  const hardIdx = idx - easy.length;

  if (hardIdx < hard.length) {

    await sendMessage(token, chatId, {
      text:
        `🔴 سؤال سخت\n\n` +
        `امتیاز: ${score}\n\n` +
        `${hard[hardIdx]}`,

      reply_markup: {
        inline_keyboard: [[
          {
            text: "✅ درست",
            callback_data: `correct_${idx}_${score}`
          },
          {
            text: "❌ غلط",
            callback_data: `wrong_${idx}_${score}`
          }
        ]]
      }
    });

    return;
  }


  // پایان بازی
  await sendMessage(token, chatId, {
    text:
      `🎉 بازی تمام شد!\n\n` +
      `🏆 امتیاز نهایی: ${score}`
  });
}


// ============================
// ارسال پیام به تلگرام
// ============================

async function sendMessage(token, chatId, data) {

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        chat_id: chatId,
        ...data
      })
    }
  );

  const result = await response.json();

  if (!result.ok) {
    console.error("خطای تلگرام:", result);
  }

  return result;
}


// ============================
// حذف Loading دکمه
// ============================

async function answerCallback(token, callbackId) {

  await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        callback_query_id: callbackId
      })
    }
  );
      }
