const Hospital = require('../models/hospital.model');

exports.getHospitals = async (req, res) => {
  try {
    const list = await Hospital.find().populate('departments');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bệnh viện', error });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('departments');
    if (!hospital) return res.status(404).json({ message: 'Không tìm thấy bệnh viện' });
   
    const doctors = await Doctor.find({ hospitalId: hospital._id }).populate('specializationId');

    res.json({
      ...hospital.toObject(),
      doctors
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy bệnh viện', error });
  }
};

exports.createHospital = async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi tạo bệnh viện', error });
  }
};

exports.updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hospital) return res.status(404).json({ message: 'Không tìm thấy bệnh viện' });
    res.json(hospital);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật bệnh viện', error });
  }
};

exports.deleteHospital = async (req, res) => {
  try {
    const result = await Hospital.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy bệnh viện' });
    res.json({ message: 'Đã xóa bệnh viện' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa bệnh viện', error });
  }
};

///////////////////
// Hiển thị danh sách
exports.renderPage = async (req, res) => {
    const hospitals = await Hospital.find();
    res.render('admin/hospitals', { hospitals });
  };
  
  // Thêm hoặc cập nhật
  exports.handleForm = async (req, res) => {
    try {
      const { id, fullName, level, specializationId, hospitalId } = req.body;
  
      if (id) {
        await Doctor.findByIdAndUpdate(id, { fullName, level, specializationId, hospitalId });
      } else {
        await Doctor.create({ fullName, level, specializationId, hospitalId});
      }
  
      res.redirect('/admin/doctors'); // ⬅️ Cần phải res.redirect hoặc res.send
    } catch (error) {
      console.error("❌ Lỗi khi xử lý doctor:", error);
      res.status(500).send("Lỗi khi lưu bác sĩ");
    }
  };
  
  
  // Xóa bệnh viện
  exports.delete = async (req, res) => {
    try {
      await Hospital.findByIdAndDelete(req.params.id);
      res.redirect('/admin/hospitals');
    } catch (error) {
      res.status(500).send('Lỗi xoá bệnh viện');
    }
  };