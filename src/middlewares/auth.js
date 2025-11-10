function requiereAuth(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res.redirect("/login");
}

// Middleware para rutas solo para invitados, no logueados
function requiereInvitado(req, res, next) {
  if (req.session && req.session.usuario) {
    return res.redirect("/productos");
  }
  return next();
}

module.exports = {
  requiereAuth,
  requiereInvitado,
};