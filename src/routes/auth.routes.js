const express = require("express");
const { body } = require("express-validator");
const {
  registrarUsuario,
  login,
  logout,
  perfil,
} = require("../controllers/auth.controller");

const router = express.Router();

const validRegistro = [
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2 }).withMessage("Minimo 2 caracteres"),
  body("email")
    .isEmail().withMessage("Correo invalido"),
  body("password")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener minimo 6 caracteres"),
];

const validLogin = [
  body("email")
    .isEmail().withMessage("Correo invalido"),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria"),
];

router.post("/registro", validRegistro, registrarUsuario);
router.post("/login", validLogin, login);
router.post("/logout", logout);
router.get("/perfil", perfil);

module.exports = router;
