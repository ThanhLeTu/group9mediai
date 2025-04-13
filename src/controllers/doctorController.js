const Doctor = require('../models/doctor.model');
const Specialization = require('../models/specialization.model');
const Hospital = require('../models/hospital.model');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
    .populate('specializationId')
    .populate('hospitalId');
  
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};
exports.createDoctor = async (req, res) => {
    try {
      // ✅ BƯỚC 1: Kiểm tra xem bác sĩ đã tồn tại chưa
      const existing = await Doctor.findOne({
        fullName: req.body.fullName,
        hospitalId: req.body.hospitalId,
        specializationId: req.body.specializationId,
      });
      if (existing) {
        return res.status(400).json({ message: 'Bác sĩ đã tồn tại trong bệnh viện với chuyên khoa này' });
      }
  
      // ✅ BƯỚC 2: Tạo bác sĩ mới
      const doctor = new Doctor(req.body);
      await doctor.save();
  
      // ✅ BƯỚC 3: Cập nhật hospital (add specialization nếu chưa có)
      await Hospital.findByIdAndUpdate(
        doctor.hospitalId,
        { $addToSet: { departments: doctor.specializationId } }  // không thêm trùng
      );
  
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi tạo bác sĩ', error });
    }
  };
  
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('specializationId');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor', error });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const result = await Doctor.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error });
  }
};


///////////////////

// Hiển thị giao diện
exports.renderPage = async (req, res) => {
    const doctors = await Doctor.find().populate('hospitalId specializationId');
    const hospitals = await Hospital.find();
    const specializations = await Specialization.find();
    res.render('admin/doctors', { doctors, hospitals, specializations });
  };
  
  // Thêm / cập nhật bác sĩ
  exports.handleForm = async (req, res) => {
    const { id, fullName, level, specializationId, hospitalId } = req.body;

    if (id) {
      await Doctor.findByIdAndUpdate(id, { fullName, level, specializationId, hospitalId });
    } else {
      await Doctor.create({ fullName, level, specializationId, hospitalId });
    
      await Hospital.findByIdAndUpdate(hospitalId, {
        $addToSet: { departments: specializationId }
      });
    }
    
  };
  
  // Xóa bác sĩ
  exports.delete = async (req, res) => {
    try {
      await Doctor.findByIdAndDelete(req.params.id);
      res.redirect('/admin/doctors');
    } catch (error) {
      res.status(500).send('Lỗi xóa bác sĩ');
    }
  };