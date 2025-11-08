function requiereAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ ok: false, mensaje: "No autorizado" });
  }
  next();
}

function requiereAdmin(req, res, next) {
  if (!req.session || !req.session.usuario || req.session.usuario.rol !== "admin") {
    return res.status(403).json({ ok: false, mensaje: "Solo administradores" });
  }
  next();
}

module.exports = { requiereAuth, requiereAdmin };
