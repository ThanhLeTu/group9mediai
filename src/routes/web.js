const express = require('express');
const router = express.Router();
const specializationController = require('../controllers/specializationController');
const hospitalController = require('../controllers/hospitalController');
const doctorController = require('../controllers/doctorController');
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
const vaccinationController = require('../controllers/vaccinationController');
const medicalController = require('../controllers/medicalRecordController');

// Giao diện cơ bản
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { message: null });
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

router.get('/welcome', (req, res) => {
  const email = req.query.email;
  res.render('welcome', { email });
});

// Dashboard giao diện admin
router.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

// Giao diện quản lý chuyên khoa (render EJS)
router.get('/admin/specializations', specializationController.renderPage);
router.post('/admin/specializations', specializationController.handleForm);
router.post('/admin/specializations/delete/:id', specializationController.delete);


// Giao diện admin quản lý bệnh viện
router.get('/admin/hospitals', hospitalController.renderPage);
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

module.exports = router;

