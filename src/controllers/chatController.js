const { chatWithGemini } = require('../utils/gemini');

exports.chooseSpecializationAI = async (req, res) => {
  const { symptom, specializations } = req.body;

  if (!symptom || !Array.isArray(specializations)) {
    return res.status(400).json({ message: "Thiếu symptom hoặc danh sách specializations" });
  }

  const prompt = `
Bạn là MediBot, trợ lý AI đặt lịch khám bệnh. Người dùng nói rằng họ đang bị: "${symptom}".

Dưới đây là danh sách các chuyên khoa:
${specializations.map(s => `- ${s}`).join('\n')}

Hãy chọn ra 1 chuyên khoa phù hợp nhất từ danh sách trên. 
Chỉ trả về đúng tên chuyên khoa đó, không giải thích thêm.
`;

  try {
    const reply = await chatWithGemini(prompt);
    const specializationName = reply.trim().split('\n')[0].replace(/[^a-zA-Z\s]/g, '').trim();

    res.json({ specializationName });
  } catch (err) {
    res.status(500).json({ message: "AI error", error: err.message });
  }
};
