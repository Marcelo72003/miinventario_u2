const { validationResult } = require("express-validator");
const Producto = require("../models/Producto");

function manejarValidacion(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Los datos enviados no son válidos");
    error.status = 400;
    error.details = errors.array();
    throw error;
  }
}

//Crear producto: POST /api/products
async function crearProducto(req, res, next) {
  try {
    manejarValidacion(req);
    const { nombre, precio, descripcion } = req.body;

    const imagen = req.file ? req.file.filename : "sin-imagen.png";

    const nuevoProducto = await Producto.create({
      nombre,
      precio,
      descripcion,
      imagen,
    });

    res.status(201).json({
      ok: true,
      mensaje: "Producto creado correctamente",
      data: nuevoProducto,
    });
  } catch (err) {
    next(err);
  }
}

//Listar productos: GET /api/products
async function listarProductos(req, res, next) {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json({
      ok: true,
      total: productos.length,
      data: productos,
    });
  } catch (err) {
    next(err);
  }
}

//Obtener un producto por ID: GET /api/products/:id
async function obtenerProducto(req, res, next) {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);

    if (!producto) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Producto no encontrado" });
    }

    res.json({ ok: true, data: producto });
  } catch (err) {
    next(err);
  }
}

//Actualizar: PUT /api/products/:id
async function actualizarProducto(req, res, next) {
  try {
    manejarValidacion(req);
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;

    const cambios = { nombre, precio, descripcion };

    if (req.file) {
      cambios.imagen = req.file.filename;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    });

    if (!productoActualizado) {
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    }

    res.json({
      ok: true,
      mensaje: "Producto actualizado correctamente",
      data: productoActualizado,
    });
  } catch (err) {
    next(err);
  }
}

//Elimiar producto: DELETE /api/products/:id
async function eliminarProducto(req, res, next) {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    }

    res.json({ ok: true, message: "Producto eliminado correctamente" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
};
