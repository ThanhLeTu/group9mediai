const VaccinationSchedule = require('../models/vaccinationSchedule.model');

exports.getSchedules = async (req, res) => {
  try {
    const list = await VaccinationSchedule.find().populate('userId');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách lịch tiêm', error });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await VaccinationSchedule.findById(req.params.id).populate('userId');
    if (!schedule) return res.status(404).json({ message: 'Không tìm thấy lịch tiêm' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lịch tiêm', error });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const schedule = new VaccinationSchedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi tạo lịch tiêm', error });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await VaccinationSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) return res.status(404).json({ message: 'Không tìm thấy lịch tiêm' });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật lịch tiêm', error });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const result = await VaccinationSchedule.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy lịch tiêm' });
    res.json({ message: 'Đã xóa lịch tiêm' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa lịch tiêm', error });
  }
};
