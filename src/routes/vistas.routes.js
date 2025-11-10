const express = require("express");
const Producto = require("../models/Producto");
const { requiereAuth, requiereInvitado } = require("../middlewares/auth");

const router = express.Router();

// Middleware para hacer disponible la sesion en las vistas
router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Home:
// - Si esta logueado -> /productos
// - Si no -> /login
router.get("/", (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/productos");
  }
  return res.redirect("/login");
});

// Pagina de login
router.get("/login", requiereInvitado, (req, res) => {
  const exito = req.session.mensajeExito;
  delete req.session.mensajeExito;

  res.render("auth/login", {
    titulo: "Iniciar sesión",
    exito,
  });
});


// Pagina de registro
router.get("/registro", requiereInvitado, (req, res) => {
  res.render("auth/registro", { titulo: "Crear cuenta" });
});

// Lista de productos
router.get("/productos", requiereAuth, async (req, res, next) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 }).lean();

    res.render("productos/lista", {
      titulo: "Listado de productos",
      productos,
    });
  } catch (err) {
    next(err);
  }
});

// Formulario crear producto
router.get("/productos/nuevo", (req, res) => {
  res.render("productos/form", {
    titulo: "Crear producto",
    accion: "/api/productos",
    metodo: "POST",
    botonTexto: "Crear producto",
  });
});

// Formulario editar producto
router.get("/productos/:id/editar", requiereAuth, async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id).lean();
    if (!producto) {
      return res
        .status(404)
        .render("404", { mensaje: "Producto no encontrado" });
    }

    res.render("productos/form", {
      titulo: "Editar producto",
      producto,
      accion: `/api/productos/${producto._id}`,
      botonTexto: "Guardar cambios",
      editar: true,
    });
  } catch (err) {
    next(err);
  }
});

// Chat
router.get("/chat", requiereAuth, (req, res) => {
  res.render("chat", {
    titulo: "Chat en tiempo real",
  });
});


module.exports = router;
