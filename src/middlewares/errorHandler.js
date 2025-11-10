// src/middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error("Error: ", err);

  const status = err.status || 500;

  const mensaje = err.message || "Error interno del servidor";

  res.status(status).json({
    ok: false,
    mensaje,
    errores: err.details || null,
  });
};
