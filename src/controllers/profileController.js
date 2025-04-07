const Profile = require('../models/profile.model');
const User = require('../models/user.model');

// GET /api/profile/me
// Ví dụ trong ProfileController

exports.getMyProfile = async (req, res) => {
    try {
      const profile = await Profile.findOne({ userId: req.user.id });
  
      // ✅ Nếu chưa có profile → chỉ trả user info
      if (!profile) {
        const user = await User.findById(req.user.id).select("fullName email");
        return res.status(200).json({
          user,
          profile: null
        });
      }
  
      // ✅ Có profile → trả cả 2
      const user = await User.findById(req.user.id).select("fullName email");
      res.status(200).json({
        user,
        profile
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  };

// POST or PUT /api/profile

exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const update = { ...req.body, userId };

    // ✅ Tạo hoặc cập nhật profile
    const profile = await Profile.findOneAndUpdate(
      { userId },
      update,
      { new: true, upsert: true }
    );

    // ✅ Cập nhật profileId vào User nếu chưa có
    await User.findByIdAndUpdate(userId, { profileId: profile._id });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};