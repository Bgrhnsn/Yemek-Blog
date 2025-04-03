const express = require('express');
const router = express.Router();
const { requireLogin, requireAdmin } = require('../middleware/auth');

router.get('/admin', requireLogin, requireAdmin, (req, res) => {
  res.render('admin/index');
});

module.exports = router;
