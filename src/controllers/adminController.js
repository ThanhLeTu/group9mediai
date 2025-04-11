const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');
const Appointment = require('../models/appointment.model');
const Vaccination = require('../models/vaccinationSchedule.model');
const MedicalRecord = require('../models/medicalRecord.model');
// Then in your controller:
exports.dashboard = async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const avatar = req.file ? `/uploads/doctors/${req.file.filename}` : undefined;

      const stats = {
        totalPatients: await User.countDocuments({ role: 'client' }),
        totalDoctors: await Doctor.countDocuments(),
        totalHospitals: await Hospital.countDocuments(),
        totalRecords: await MedicalRecord.countDocuments(),
        appointmentsToday: await Appointment.countDocuments({ date: { $gte: today } }),
        vaccinationsToday: await Vaccination.countDocuments({ scheduledDate: { $gte: today } }),
        completedAppointments: await Appointment.countDocuments({ status: 'completed' }),
        upcomingVaccinations: await Vaccination.countDocuments({ scheduledDate: { $gte: today }, status: 'scheduled' }),
        totalAdmins: await User.countDocuments({ role: 'admin' }),
      };
  
      const doctors = await Doctor.find().limit(5).populate('specializationId');
  
      res.render('admin/dashboard', {
        stats,
        doctors, // 👈 thêm dòng này để truyền vào view
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).send('Dashboard loading error: ' + error.message); // bạn cũng có thể render error.ejs nếu đã có
    }
  };
  

  exports.getAppointments = async (req, res) => {
    const appointments = await Appointment.find().populate('userId doctorId');
    const users = await User.find();
    const doctors = await Doctor.find();
  
    res.render('admin/appointments', { appointments, users, doctors });
  };
  
  exports.getHospitals = async (req, res) => {
    const hospitals = await Hospital.find();
    res.render('admin/hospitals', { hospitals });
  };
  
  exports.handleForm = async (req, res) => {
  const { id, fullName, level, specializationId, hospitalId } = req.body;
  const avatar = req.file ? `/uploads/doctors/${req.file.filename}` : undefined;

  try {
    if (id) {
      const updateData = { fullName, level, specializationId, hospitalId };
      if (avatar) updateData.avatar = avatar;
      await Doctor.findByIdAndUpdate(id, updateData);
    } else {
      await Doctor.create({ fullName, level, specializationId, hospitalId, avatar });

      await Hospital.findByIdAndUpdate(hospitalId, {
        $addToSet: { departments: specializationId }
      });
    }

    res.redirect('/admin/doctors');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi xử lý bác sĩ');
  }
};
