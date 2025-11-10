const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

function manejarValidacion(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Datos invalidos");
    error.status = 400;
    error.details = errors.array();
    throw error;
  }
}

//POST auth/registro
async function registrarUsuario(req, res, next) {
  try {
    const errors = validationResult(req);
    const isForm =
      (req.headers["content-type"] || "").includes(
        "application/x-www-form-urlencoded"
      ) ||
      (req.headers["content-type"] || "").includes("multipart/form-data");

    if (!errors.isEmpty()) {
      if (isForm) {
        // Volver al formulario con el primer error
        return res.status(400).render("auth/registro", {
          titulo: "Crear cuenta",
          error: errors.array()[0].msg,
          old: req.body,
        });
      }
      return res.status(400).json({
        ok: false,
        mensaje: "Datos inválidos",
        errores: errors.array(),
      });
    }

    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      if (isForm) {
        return res.status(400).render("auth/registro", {
          titulo: "Crear cuenta",
          error: "El correo ya está registrado",
          old: req.body,
        });
      }
      return res
        .status(400)
        .json({ ok: false, mensaje: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: rol === "admin" ? "admin" : "usuario",
    });

    //Formulario HTML: mensaje + redirección a login
    if (isForm) {
      req.session.mensajeExito =
        "Usuario registrado correctamente. Ahora puedes iniciar sesión.";
      return res.redirect("/login");
    }

    //Postman / API: devolver JSON
    return res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    // Usuario no encontrado o contraseña incorrecta
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.render("auth/login", {
        titulo: "Iniciar sesión",
        error: "⚠️ Credenciales incorrectas. Inténtalo de nuevo.",
      });
    }

    // Guardar sesion
    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    return res.redirect("/productos");
  } catch (err) {
    next(err);
  }
}

// POST /auth/logout
function logout(req, res, next) {
  try {
    if (!req.session || !req.session.usuario) {
      // Si no hay sesión igual se va al al login
      return res.redirect("/login");
    }

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      return res.redirect("/login");
    });
  } catch (err) {
    next(err);
  }
}


// GET /auth/perfil
function perfil(req, res) {
  if (!req.session.usuario) {
    return res.status(401).json({ ok: false, mensaje: "No autenticado" });
  }
  res.json({ ok: true, usuario: req.session.usuario });
}

module.exports = {
  registrarUsuario,
  login,
  logout,
  perfil,
};