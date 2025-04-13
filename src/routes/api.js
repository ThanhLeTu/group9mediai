const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser
} = require('../controllers/userController');

const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const profileController = require('../controllers/profileController');
const doctorController = require('../controllers/doctorController');
const specializationController = require('../controllers/specializationController'); 
const medicalController = require('../controllers/medicalRecordController');
const apptController = require('../controllers/appointmentController');
const hospitalController = require('../controllers/hospitalController');
const vaccineController = require('../controllers/vaccinationController');
const chatController = require('../controllers/chatController');
const { chatWithGemini } = require('../utils/gemini');
const Specialization = require('../models/specialization.model');
const Hospital = require('../models/hospital.model');
const Appointment = require('../models/appointment.model');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected dashboard
router.get(
  '/admin/dashboard',
  verifyToken,         // ✅ phải là function
  checkRole('admin'),  // ✅ phải là function
  (req, res) => {       // ✅ bạn đang dùng hàm này
    res.json({ message: "Chào Admin!" });
  }
);

// Profile
// ✅ Route lấy thông tin cá nhân (GET)
router.get('/profile/me', authenticate, profileController.getMyProfile);

// ✅ Route cập nhật hồ sơ (POST/PUT)
router.post('/profile', authenticate, profileController.updateMyProfile);

// Doctors
router.get('/doctors', doctorController.getAllDoctors);
router.post('/doctors', doctorController.createDoctor);
router.get('/doctors/:id', doctorController.getDoctorById);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

// Specializations (API JSON)
router.get('/specializations', specializationController.getAllSpecializations);
router.post('/specializations', specializationController.createSpecialization);
router.get('/specializations/:id', specializationController.getSpecializationById);
router.put('/specializations/:id', specializationController.updateSpecialization);
router.delete('/specializations/:id', specializationController.deleteSpecialization);

// Medical Records
router.get('/medical-records', medicalController.getAllRecords);
router.post('/medical-records', medicalController.createRecord);

// Appointments
router.get('/appointments', apptController.getAppointments);
router.post('/appointments', apptController.createAppointment);

// Hospitals
router.get('/hospitals', hospitalController.getHospitals);
router.post('/hospitals', hospitalController.createHospital);

// Vaccinations
router.get('/vaccinations', vaccineController.getSchedules);
router.post('/vaccinations', vaccineController.createSchedule);

//Chat

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const reply = await chatWithGemini(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: '❌ Lỗi xử lý AI.' });
  }
});

router.get('/chatbot/specializations', async (req, res) => {
  const { name } = req.query;
  const spec = await Specialization.findOne({ name: new RegExp(name, 'i') });
  if (!spec) return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
  res.json(spec);
});

router.get('/chatbot/hospitals', async (req, res) => {
  const specId = req.query.specializationId;
  const results = await Hospital.find({
    departments: specId
  });
  res.json(results);
});

router.post('/chatbot/ai-specialization', chatController.chooseSpecializationAI);
router.get('/chatbot/specialization-names', chatController.getAllSpecializationNames);


router.post('/chatbot/appointments', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập để đặt lịch.' });
    }

    const { doctorId, date, time, reason } = req.body;
    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorId,
      date,
      time,
      reason
    });

    res.json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi tạo lịch hẹn' });
  }
});
module.exports = router;
