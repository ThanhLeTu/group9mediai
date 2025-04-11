const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'client' 
    });

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


// Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.render('login', { error: 'Email không tồn tại', layout: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('login', { error: 'Sai mật khẩu', layout: false });

    // ✅ Tạo token chứa role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Lưu cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ✅ Redirect theo role
    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/welcome');
    }

  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Lỗi server', layout: false });
  }
};


////////////
// Giao diện admin
exports.renderPage = async (req, res) => {
  try {
    const users = await User.find().populate('profileId');
    res.render('admin/users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi lấy danh sách người dùng');
  }
};


// Thêm hoặc cập nhật user (EJS)
exports.handleForm = async (req, res) => {
  const { id, email, fullName, role, gender, birthDate, address, phone, identityNumber } = req.body;

  try {
    if (id) {
      // ✅ Cập nhật User
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).send('Không tìm thấy người dùng');
      }
      
      user.fullName = fullName;
      user.email = email;
      user.role = role;
      await user.save();

      // Kiểm tra xem user đã có profile chưa
      let profile = await Profile.findOne({ userId: id });
      
      if (profile) {
        // Cập nhật profile hiện có
        profile.gender = gender;
        profile.birthDate = birthDate;
        profile.address = address;
        profile.phone = phone;
        profile.identityNumber = identityNumber;
        await profile.save();
      } else {
        // Tạo profile mới nếu chưa có
        profile = new Profile({
          userId: id,
          gender,
          birthDate,
          address,
          phone,
          identityNumber
        });
        await profile.save();
        
        // Cập nhật profileId trong user
        user.profileId = profile._id;
        await user.save();
      }
    } else {
      // ✅ Kiểm tra tồn tại
      const exists = await User.findOne({ email });
      if (exists) return res.redirect('/admin/users');

      // ✅ Tạo User mới
      const newUser = new User({
        email,
        fullName,
        password: await bcrypt.hash('123456', 10),
        role
      });
      await newUser.save();

      // ✅ Tạo Profile mới
      const profile = new Profile({
        userId: newUser._id,
        gender,
        birthDate,
        address,
        phone,
        identityNumber
      });
      await profile.save();

      // ✅ Gán profileId vào User
      newUser.profileId = profile._id;
      await newUser.save();
    }

    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi xử lý người dùng');
  }
};

// Xoá user
exports.delete = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Xóa profile liên quan
    await Profile.findOneAndDelete({ userId: userId });
    
    // Xóa user
    await User.findByIdAndDelete(userId);
    
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi xoá người dùng');
  }
};