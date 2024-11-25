
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/usuarios/login');
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.rol === 'admin') {
    return next();
  }
  res.status(403).send('Acceso denegado');
}

function isCliente(req, res, next) {
  if (req.isAuthenticated() && req.user.rol === 'cliente') {
    return next();
  }
  res.status(403).send('Acceso denegado. Solo los clientes pueden realizar esta acción.');
}

module.exports = { ensureAuthenticated, isAdmin, isCliente };