const MedicalRecord = require('../models/medicalRecord.model');
const User = require('../models/user.model');

exports.getAllRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find().populate('userId doctorId');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bệnh án', error });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate('userId doctorId');
    if (!record) return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy bệnh án', error });
  }
};

exports.createRecord = async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi tạo bệnh án', error });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật bệnh án', error });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const result = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy bệnh án' });
    res.json({ message: 'Đã xóa bệnh án' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa bệnh án', error });
  }
};
/////////////

// Trang admin
exports.renderPage = async (req, res) => {
    try {
      const records = await MedicalRecord.find().populate('userId', 'fullName email');
      const users = await User.find({}, 'fullName email');
      res.render('admin/records', { records, users });
    } catch (error) {
      res.status(500).send('Lỗi hiển thị hồ sơ bệnh án');
    }
  };
  
  // Thêm hoặc cập nhật
  exports.handleForm = async (req, res) => {
    const { id, userId, diagnosis, treatment, notes, date } = req.body;
  
    try {
      if (id) {
        await MedicalRecord.findByIdAndUpdate(id, {
          userId, diagnosis, treatment, notes, date
        });
      } else {
        await MedicalRecord.create({
          userId, diagnosis, treatment, notes, date
        });
      }
  
      res.redirect('/admin/records');
    } catch (error) {
      res.status(500).send('Lỗi xử lý hồ sơ bệnh án');
    }
  };
  
  exports.delete = async (req, res) => {
    try {
      await MedicalRecord.findByIdAndDelete(req.params.id);
      res.redirect('/admin/records');
    } catch (error) {
      res.status(500).send('Lỗi xoá hồ sơ bệnh án');
    }
  };