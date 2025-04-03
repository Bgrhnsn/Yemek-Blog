function requireLogin(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/login');
  }
  
  function requireAdmin(req, res, next) {
    if (req.session.isAdmin) {
      return next();
    }
    res.status(403).send('Admin erişimi gerekli.');
  }
  
  module.exports = {
    requireLogin,
    requireAdmin
  };
  