const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  specializationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization',
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  
  level: {
    type: String,
    enum: ['Intern', 'Resident', 'Specialist', 'Consultant'],
    required: true,
  },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
