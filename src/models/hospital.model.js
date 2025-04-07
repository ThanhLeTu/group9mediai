const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' }]
});

module.exports = mongoose.model('Hospital', HospitalSchema);
