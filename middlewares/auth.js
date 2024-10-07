
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.rol === 'Admin') {
    return next();
  }
  res.status(403).send('Acceso denegado');
}

module.exports = { ensureAuthenticated, isAdmin };