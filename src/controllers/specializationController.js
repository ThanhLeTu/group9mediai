const Specialization = require('../models/specialization.model');

exports.getAllSpecializations = async (req, res) => {
  try {
    const list = await Specialization.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách chuyên khoa', error });
  }
};

exports.createSpecialization = async (req, res) => {
    try {
      const existing = await Specialization.findOne({ name: req.body.name });
      if (existing) {
        return res.status(400).json({ message: 'Chuyên khoa đã tồn tại' });
      }
  
      const spec = new Specialization(req.body);
      await spec.save();
      res.status(201).json(spec);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi tạo chuyên khoa', error });
    }
  };
  

exports.getSpecializationById = async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);
    if (!specialization) return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
    res.json(specialization);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy chuyên khoa', error });
  }
};

exports.updateSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!specialization) return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
    res.json(specialization);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật chuyên khoa', error });
  }
};

exports.deleteSpecialization = async (req, res) => {
  try {
    const result = await Specialization.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
    res.json({ message: 'Đã xóa chuyên khoa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa chuyên khoa', error });
  }
};
///////////////////

// Dành cho giao diện EJS
exports.renderPage = async (req, res) => {
    const specializations = await Specialization.find();
    res.render('admin/specializations', { specializations });
  };
  
  exports.handleForm = async (req, res) => {
    const { id, name, description } = req.body;
  
    if (id) {
      await Specialization.findByIdAndUpdate(id, { name, description });
    } else {
      const exists = await Specialization.findOne({ name });
      if (!exists) await Specialization.create({ name, description });
    }
  
    res.redirect('/admin/specializations');
  };

  
exports.delete = async (req, res) => {
    await Specialization.findByIdAndDelete(req.params.id);
    res.redirect('/admin/specializations');
  };

  