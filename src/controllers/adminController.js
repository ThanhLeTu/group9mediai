const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');
const Appointment = require('../models/appointment.model');
const Vaccination = require('../models/vaccinationSchedule.model');
const MedicalRecord = require('../models/medicalRecord.model');
const Specialization = require('../models/specialization.model');
// Then in your controller:
exports.dashboard = async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0, 10);

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
  try {
    const hospitals = await Hospital.find().populate('departments');
    const specializations = await Specialization.find(); // ✅ lấy danh sách khoa

    res.render('admin/hospitals', {
      hospitals,
      specializations, // ✅ truyền vào view
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách bệnh viện:", err);
    res.status(500).send("Lỗi server khi lấy dữ liệu bệnh viện");
  }
};
exports.handleForm = async (req, res) => {
  const { id, fullName, level, specializationId, hospitalId } = req.body;

  try {
    if (id) {
      const updateData = { fullName, level, specializationId, hospitalId };
      await Doctor.findByIdAndUpdate(id, updateData);
    } else {
      await Doctor.create({ fullName, level, specializationId, hospitalId });

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
