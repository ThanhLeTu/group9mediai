const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');
const profileController = require('../controllers/profileController');

// API xử lý đăng ký / đăng nhập
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/admin/dashboard',
    verifyToken,
    checkRole('admin'),
    (req, res) => {
      res.send("Chào Admin!");
    }
  );

// Profile APIs
router.get('/profile/me', verifyToken, profileController.getMyProfile);
router.post('/profile', verifyToken, profileController.updateMyProfile); // hoặc PUT

module.exports = router;
