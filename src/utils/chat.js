const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'models/gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent`;

async function chatWithGemini(prompt) {
  const SYSTEM_PROMPT = `
Bạn là MediBot, trợ lý AI hỗ trợ người dùng đặt lịch khám bệnh tại các bệnh viện.
- Hãy phản hồi thân thiện, rõ ràng.
- Gợi ý chuyên khoa phù hợp, gợi ý bệnh viện, bác sĩ nếu có.
- Nếu người dùng nói về chủ đề khác, có thể trả lời nhẹ nhàng nhưng quay về chủ đề đặt lịch khám bệnh.
`;

  const fullPrompt = `${SYSTEM_PROMPT}\n\nNgười dùng nói: ${prompt}`;

  try {
    const res = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }]
        }
      ]
    });

    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "🤖 Xin lỗi, tôi chưa rõ ý bạn.";
  } catch (err) {
    console.error("❌ Gemini error:", err.response?.data || err.message);
    return `❌ Lỗi AI: ${err.response?.data?.error?.message || err.message}`;
  }
}

module.exports = { chatWithGemini };
