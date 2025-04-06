const Profile = require('../models/profile.model');

// GET /api/profile/me
// Ví dụ trong ProfileController
exports.getMyProfile = async (req, res) => {
    try {
      const userId = req.user.id; // lấy từ token
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: "Chưa có hồ sơ cá nhân" });
      }
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  };
  

// POST or PUT /api/profile
exports.updateMyProfile = async (req, res) => {
  try {
    const update = { ...req.body, userId: req.user.id };
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      update,
      { new: true, upsert: true } // tạo nếu chưa có
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};
