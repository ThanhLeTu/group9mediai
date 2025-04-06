const express = require('express');
const router = express.Router();

// Trang giao diện
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { message: null });
});


router.get('/welcome', (req, res) => {
  const email = req.query.email;
  res.render('welcome', { email });
});

module.exports = router;
