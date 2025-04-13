const VaccinationSchedule = require('../models/vaccinationSchedule.model');
const User = require('../models/user.model');

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


///////////////

// Giao diện admin
exports.renderPage = async (req, res) => {
    try {
      const schedules = await VaccinationSchedule.find()
        .populate('userId', 'fullName email');
      const users = await User.find({}, 'fullName email');
  
      res.render('admin/vaccinations', { schedules, users });
    } catch (err) {
      res.status(500).send('Lỗi hiển thị lịch tiêm');
    }
  };
  
  // Tạo hoặc cập nhật
  exports.handleForm = async (req, res) => {
    const { id, userId, vaccineName, scheduledDate, dose, status } = req.body;
  
    try {
      if (id) {
        await VaccinationSchedule.findByIdAndUpdate(id, {
          userId, vaccineName, scheduledDate, dose, status
        });
      } else {
        await VaccinationSchedule.create({
          userId, vaccineName, scheduledDate, dose, status
        });
      }
  
      res.redirect('/admin/vaccinations');
    } catch (err) {
      res.status(500).send('Lỗi xử lý lịch tiêm');
    }
  };
  
  exports.delete = async (req, res) => {
    try {
      await VaccinationSchedule.findByIdAndDelete(req.params.id);
      res.redirect('/admin/vaccinations');
    } catch (err) {
      res.status(500).send('Lỗi xoá lịch tiêm');
    }
  };
  exports.renderClientPage = async (req, res) => {
    try {
      const schedules = await VaccinationSchedule.find()
        .populate('userId', 'fullName');
  
        res.render('vaccinations', { schedules });
        // render đúng file EJS bạn sẽ tạo
    } catch (error) {
      console.error("❌ Lỗi client vaccinations:", error.message);
      res.status(500).send('Lỗi khi tải danh sách vắc xin');
    }
  };
  exports.renderBookingSuccess = async (req, res) => {
    try {
      const schedule = await VaccinationSchedule.findById(req.params.id).populate('userId');
      if (!schedule) return res.status(404).send('Không tìm thấy phiếu đặt lịch');
  
      res.render('booking-vaccine-success', { schedule }); // tạo file EJS tương ứng
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi hiển thị thông tin phiếu đã đặt');
    }
  };
  // Submit giờ tiêm
  exports.submitBookingTime = async (req, res) => {
    try {
      const { time } = req.body;
  
      const schedule = await VaccinationSchedule.findByIdAndUpdate(
        req.params.id,
        {
          time,
          status: 'scheduled',
          userId: req.user._id // ✅ Gán lại userId
        },
        { new: true }
      );
  
      if (!schedule) return res.status(404).send('Không tìm thấy lịch tiêm');
      res.redirect('/booking-vaccine/success/' + schedule._id);
    } catch (error) {
      console.error('❌ Lỗi submitBookingTime:', error);
      res.status(500).send('Lỗi khi xác nhận giờ tiêm');
    }
  };
  