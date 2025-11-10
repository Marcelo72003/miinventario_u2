const express = require("express");
const {
  registrarUsuario,
  login,
  logout,
  perfil,
} = require("../controllers/auth.controller");
const {
  validarRegistro,
  validarLogin,
} = require("../validators/auth.validators");

const router = express.Router();

// Rutas de autenticacion
router.post("/registro", validarRegistro, registrarUsuario);
router.post("/login", validarLogin, login);
router.post("/logout", logout);
router.get("/perfil", perfil);

module.exports = router;
