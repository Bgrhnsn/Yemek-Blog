const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// Admin → Duyuru formu
router.get('/admin/announcements/new', requireLogin, requireAdmin, (req, res) => {
  res.render('admin/new-announcement');
});

// Admin → Duyuru gönderme
router.post('/admin/announcements', requireLogin, requireAdmin, async (req, res) => {
  try {
    await Announcement.create({
      title: req.body.title,
      content: req.body.content
    });
    res.redirect('/');
  } catch (err) {
    res.send('Duyuru eklenemedi: ' + err.message);
  }
});

module.exports = router;
