// src/middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;

  const respuesta = {
    ok: false,
    mensaje: err.message || "Error interno del servidor",
  };

  if (err.details) {
    respuesta.details = err.details;
  }

  res.status(status).json(respuesta);
}

module.exports = errorHandler;
