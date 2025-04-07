const Appointment = require('../models/appointment.model');

exports.getAppointments = async (req, res) => {
  try {
    const list = await Appointment.find().populate('userId doctorId');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách lịch hẹn', error });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('userId doctorId');
    if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy lịch hẹn', error });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const appt = new Appointment(req.body);
    await appt.save();
    res.status(201).json(appt);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi tạo lịch hẹn', error });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appt) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    res.json(appt);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật lịch hẹn', error });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const result = await Appointment.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    res.json({ message: 'Đã xóa lịch hẹn' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa lịch hẹn', error });
  }
};
