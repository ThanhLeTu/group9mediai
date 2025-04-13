const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "models/gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent`;

exports.chatWithGemini = async (prompt) => {
  try {
    const res = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "🤖 Xin lỗi, tôi chưa rõ ý bạn.";
  } catch (err) {
    console.error("❌ Gemini error:", err.response?.data || err.message);
    throw err;
  }
};
