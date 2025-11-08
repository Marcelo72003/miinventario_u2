const express = require("express");
const { body, param } = require("express-validator");
const {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/producto.controller");
const uploadProducto = require("../middlewares/uploadProducto");

const router = express.Router();

// Validaciones para crear producto
const validacionesCrear = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),
  body("descripcion")
    .optional().isLength({ max: 500 })
    .withMessage("La descripcion no puede superar los 500 caracteres"),
];

// Validaciones para actualizar un producto
const validacionesActualizar = [
  body("nombre").optional().isLength({ min: 2, max: 100 }),
  body("precio").optional().isFloat({ min: 0 }),
  body("descripcion").optional().isLength({ max: 500 }),
];

// Validacion del parámetro ID
const validarId = [param("id").isMongoId().withMessage("ID invalido")];

// CRUD
router.post("/", uploadProducto, validacionesCrear, crearProducto);
router.get("/", listarProductos);
router.get("/:id", validarId, obtenerProducto);
router.put(
  "/:id",
  uploadProducto,
  validarId,
  ...validacionesActualizar,
  actualizarProducto
);
router.delete("/:id", validarId, eliminarProducto);

module.exports = router;
