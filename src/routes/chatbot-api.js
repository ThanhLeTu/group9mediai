// ✅ BƯỚC 1: Tạo các API hỗ trợ cho chatbot AI

const express = require('express');
const router = express.Router();

const Hospital = require('../models/hospital.model');
const Specialization = require('../models/specialization.model');
const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');

// GET /api/specializations?keyword=ho
router.get('/specializations', async (req, res) => {
  try {
    const keyword = req.query.keyword?.toLowerCase();
    const specs = await Specialization.find();
    const matched = specs.filter(s => s.name.toLowerCase().includes(keyword));
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách chuyên khoa', error: err.message });
  }
});

// GET /api/hospitals?specializationId=...
router.get('/hospitals', async (req, res) => {
  try {
    const { specializationId } = req.query;
    const hospitals = await Hospital.find({ departments: specializationId });
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy bệnh viện', error: err.message });
  }
});

// GET /api/doctors?hospitalId=...&specializationId=...
router.get('/doctors', async (req, res) => {
  try {
    const { hospitalId, specializationId } = req.query;
    const doctors = await Doctor.find({ hospitalId, specializationId });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy bác sĩ', error: err.message });
  }
});

// POST /api/appointments
router.post('/appointments', async (req, res) => {
  try {
    const { userId, doctorId, hospitalId, specializationId, date, time, reason } = req.body;
    const newAppointment = await Appointment.create({
      userId,
      doctorId,
      hospitalId,
      specializationId,
      date,
      time,
      reason,
      status: 'pending'
    });
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo lịch hẹn', error: err.message });
  }
});

// router.get('/api/chatbot/specializations', ...)
router.get('/api/chatbot/specializations', async (req, res) => {
    const keyword = req.query.keyword || '';
    try {
      const specs = await Specialization.find({
        name: { $regex: keyword, $options: 'i' } // match "Tai", "tai", v.v.
      });
      res.json(specs);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi tìm chuyên khoa' });
    }
  });
  router.get('/api/chatbot/hospitals', async (req, res) => {
    const specId = req.query.specializationId;
    try {
      const hospitals = await Hospital.find({ departments: specId });
      res.json(hospitals);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi tìm bệnh viện' });
    }
  });
    
module.exports = router;
