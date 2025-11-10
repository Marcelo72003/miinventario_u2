const { body } = require("express-validator");

exports.validarRegistro = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo valido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol")
    .optional()
    .isIn(["admin", "usuario"])
    .withMessage("Rol inválido (solo 'admin' o 'usuario')"),
];

exports.validarLogin = [
  body("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo valido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];
