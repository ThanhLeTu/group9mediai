const express = require('express');
const router = express.Router();
const specializationController = require('../controllers/specializationController');
const hospitalController = require('../controllers/hospitalController');
const doctorController = require('../controllers/doctorController');
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
const vaccinationController = require('../controllers/vaccinationController');
const medicalController = require('../controllers/medicalRecordController');
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/upload');
const { checkRole } = require('../middlewares/auth.middleware');
// Giao diện cơ bản
router.get('/login', (req, res) => {
  res.render('login', { layout: false, error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { layout: false, message: null });
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

router.get('/welcome', (req, res) => {
  const email = req.query.email;
  res.render('welcome', {    email });
});
router.get('/logout', (req, res) => {
  // Clear cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  });
  
  // Clear cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Redirect với timestamp để tránh cache
  res.redirect('/login?_=' + Date.now());
});
// Dashboard giao diện admin
router.get('/admin/dashboard', adminController.dashboard);
router.get('/admin/appointments', adminController.getAppointments);
router.get('/admin/hospitals', adminController.getHospitals);

// Giao diện quản lý chuyên khoa (render EJS)
router.get('/admin/specializations', specializationController.renderPage);
router.post('/admin/specializations', specializationController.handleForm);
router.post('/admin/specializations/delete/:id', specializationController.delete);


// Giao diện admin quản lý bệnh viện
router.post('/admin/hospitals', hospitalController.handleForm);
router.post('/admin/hospitals/delete/:id', hospitalController.delete);

//Giao diện doctor
router.get('/admin/doctors', doctorController.renderPage);
router.post('/admin/doctors', doctorController.handleForm);
router.post('/admin/doctors/delete/:id', doctorController.delete);

//Giao diện user
router.get('/admin/users', userController.renderPage);
router.post('/admin/users', userController.handleForm);
router.post('/admin/users/delete/:id', userController.delete);

//appointment
router.get('/admin/appointments', appointmentController.renderPage);
router.post('/admin/appointments', appointmentController.handleForm);
router.post('/admin/appointments/delete/:id', appointmentController.delete);

//Vaccination
router.get('/admin/vaccinations', vaccinationController.renderPage);
router.post('/admin/vaccinations', vaccinationController.handleForm);
router.post('/admin/vaccinations/delete/:id', vaccinationController.delete);

//records
router.get('/admin/records', medicalController.renderPage);
router.post('/admin/records', medicalController.handleForm);
router.post('/admin/records/delete/:id', medicalController.delete);

// Xử lý login
router.post('/login', userController.loginUser);
//upload Avatar
router.post('/admin/doctors', upload.single('avatar'), adminController.handleForm);
module.exports = router;

