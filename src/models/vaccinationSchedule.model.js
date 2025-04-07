const mongoose = require('mongoose');

const VaccinationScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vaccineName: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  dose: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
});

module.exports = mongoose.model('VaccinationSchedule', VaccinationScheduleSchema);
