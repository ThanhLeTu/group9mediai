const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // mỗi user chỉ có 1 profile
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  birthDate: {
    type: Date,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  identityNumber: {
    type: String, // CMND/CCCD
  },
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
