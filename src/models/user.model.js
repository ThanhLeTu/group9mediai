const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile", 
    default: null
  }
});

module.exports = mongoose.model("User", userSchema);
