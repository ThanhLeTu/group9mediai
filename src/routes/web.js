const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
// Trang giao diện
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { message: null });
});

router.get('/profile', (req, res) => {
  res.render('profile');
});
router.get('/welcome', (req, res) => {
  const email = req.query.email;
  res.render('welcome', { email });
});
router.get('/dashboard', (req, res) => { // ✅ KHÔNG dùng verifyToken ở đây
  res.render('dashboard');
});

module.exports = router;
