const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login sayfası
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Giriş işlemi
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); // Gerçek projede hash karşılaştırılır!
  
  if (user) {
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    res.redirect('/admin');
  } else {
    res.send('Hatalı giriş');
  }
});

// Çıkış
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
