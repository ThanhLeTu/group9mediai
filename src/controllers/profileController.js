const Profile = require('../models/profile.model');
const User = require('../models/user.model');
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id).select("fullName email");

    res.status(200).json({
      user,
      profile
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const update = { ...req.body, userId };

    const profile = await Profile.findOneAndUpdate(
      { userId },
      update,
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(userId, { profileId: profile._id });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};
