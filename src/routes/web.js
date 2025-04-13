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
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');
const Appointment = require('../models/appointment.model');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');
const Specialization = require('../models/specialization.model'); 
router.get('/vaccinations', vaccinationController.renderClientPage);
// Xử lý xác nhận giờ tiêm chủng
router.post('/booking-vaccine/:id', ensureAuthenticated, vaccinationController.submitBookingTime);


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

router.get('/about',async (req, res) => {
  const doctors = await Doctor.find().populate('hospitalId').populate('specializationId');
  res.render('about', {doctors, layout: 'layouts/client-layout' }); // hoặc layout: 'layouts/client-layout' nếu bạn muốn dùng layout
});

router.get('/welcome', async (req, res) => {
  try {
    const email = req.query.email || null;
    const doctors = await Doctor.find().populate('hospitalId').populate('specializationId');
    const hospitals = await Hospital.find();
    const specializations = await Specialization.find(); 
    res.render('welcome', { email, doctors,hospitals , specializations}); // ✅ truyền doctors vào EJS

  } catch (err) {
    console.error("❌ Lỗi khi render welcome:", err.message);
    res.render('welcome', { email: null, doctors: [] });
  }
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
// Trang hiển thị bệnh viện (giao diện client)
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.render('hospitals', { hospitals });
  } catch (err) {
    res.status(500).send('Lỗi khi tải danh sách bệnh viện');
  }
});

// Trang hiển thị chuyên khoa (giao diện client)
router.get('/specializations', async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.render('specializations', { specializations });
  } catch (err) {
    res.status(500).send('Lỗi khi tải danh sách chuyên khoa');
  }
});
// Trang form đặt lịch
router.get('/booking/:doctorId', ensureAuthenticated, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).populate('specializationId hospitalId');
    res.render('booking', { doctor, user: req.user });
  } catch (err) {
    res.status(500).send('Không thể hiển thị trang đặt lịch');
  }
});

// Xử lý đặt lịch
router.post('/booking', ensureAuthenticated, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const userId = req.user.id;

    const appointment = new Appointment({
      doctorId,
      userId,
      date,
      time,
      reason,
      status: 'pending'
    });

    await appointment.save();
    res.render('booking-success'); // hoặc redirect đến trang xác nhận
  } catch (err) {
    res.status(500).send('Lỗi khi đặt lịch khám');
  }
});
router.get('/booking-success', (req, res) => {
  res.render('booking-success');
});
router.get('/hospitals/:hospitalId', async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const hospital = await Hospital.findById(hospitalId);
    const doctors = await Doctor.find({ hospitalId }).populate('specializationId');

    // Tạo danh sách chuyên khoa không trùng
    const specializationsMap = {};
    doctors.forEach(doc => {
      if (doc.specializationId && !specializationsMap[doc.specializationId._id]) {
        specializationsMap[doc.specializationId._id] = doc.specializationId;
      }
    });
    const specializations = Object.values(specializationsMap);

    res.render('hospital-detail', { hospital, doctors, specializations });
  } catch (err) {
    res.status(500).send('Không thể hiển thị chi tiết bệnh viện');
  }
});

router.get('/specializations/:id', async (req, res) => {
  try {
    const specializationId = req.params.id;

    const specialization = await Specialization.findById(specializationId);
    const doctors = await Doctor.find({ specializationId }).populate('hospitalId');

    res.render('specialization-doctors', { specialization, doctors }); // ✅ dòng này render view
  } catch (err) {
    console.error(err);
    res.status(500).send('Không thể tải danh sách bác sĩ theo chuyên khoa');
  }
});

// ✅ Đổi đường dẫn thành /appointments/history
router.get('/appointments/history', ensureAuthenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate('doctorId', 'fullName specializationId')
      .populate({
        path: 'doctorId',
        populate: { path: 'specializationId', select: 'name' }
      })
      .lean();

    res.render('appointments-history', { appointments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy lịch sử đặt khám');
  }
});
router.get('/vaccinations', async (req, res) => {
  try {
    const schedules = await VaccinationSchedule.find().populate('userId', 'fullName email');

    res.render('vaccinations', { schedules }); // 👈 giao diện client
  } catch (err) {
    console.error('❌ Lỗi khi tải danh sách vắc xin:', err);
    res.status(500).send('Lỗi khi tải danh sách vắc xin');
  }
});
const VaccinationSchedule = require('../models/vaccinationSchedule.model');

// Hiển thị form đặt giờ tiêm chủng
router.get('/booking-vaccine/:id', ensureAuthenticated, async (req, res) => {
  try {
    const schedule = await VaccinationSchedule.findById(req.params.id).populate('userId');
    if (!schedule) return res.status(404).send('Không tìm thấy lịch tiêm');

    res.render('booking-vaccine', { schedule });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi hiển thị form đặt giờ tiêm');
  }
});

router.get('/booking-vaccine/success/:id', vaccinationController.renderBookingSuccess);
router.get('/vaccinations/history', ensureAuthenticated, async (req, res) => {
  try {
    const schedules = await VaccinationSchedule.find({ userId: req.user.id })
      .sort({ scheduledDate: -1 });

    res.render('vaccinations-history', { schedules });
  } catch (err) {
    console.error('❌ Lỗi khi lấy lịch sử tiêm:', err);
    res.status(500).send('Lỗi khi lấy lịch sử tiêm');
  }
});

module.exports = router;

