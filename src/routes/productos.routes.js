const express = require("express");
const { param } = require("express-validator");
const {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/producto.controller");
const uploadProducto = require("../middlewares/uploadProducto");
const {
  validarCrearProducto,
  validarActualizarProducto,
} = require("../validators/producto.validators");

const router = express.Router();

// Validacion del ID de Mongo
const validarId = [
  param("id").isMongoId().withMessage("ID invalido"),
];

// Crear producto (con imagen y validaciones)
router.post(
  "/",
  uploadProducto,
  validarCrearProducto,
  crearProducto
);

// Listar todos
router.get("/", listarProductos);

// Actualizar producto
router.put(
  "/:id",
  uploadProducto,
  [...validarId, ...validarActualizarProducto],
  actualizarProducto
);

// Actualizar producto (FORM HTML - POST)
router.post(
  "/:id",
  uploadProducto,
  [...validarId, ...validarActualizarProducto],
  actualizarProducto
);

// Obtener uno por ID
router.get(
  "/:id",
  validarId,
  obtenerProducto
);

// Eliminar producto
router.delete(
  "/:id",
  validarId,
  eliminarProducto
);

module.exports = router;
