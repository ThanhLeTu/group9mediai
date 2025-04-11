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


module.exports = router;
