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
    manejarValidacion(req);

    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "El correo ya esta registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: rol === "admin" ? "admin" : "usuario",
    });

    //Guardar datos minimos en sesion
    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado y sesion iniciada",
      usuario: req.session.usuario,
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
async function login(req, res, next) {
  try {
    manejarValidacion(req);

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Credenciales incorrectas" });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Credenciales incorrectas" });
    }

    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    res.json({
      ok: true,
      mensaje: "Login exitoso",
      usuario: req.session.usuario,
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/logout
function logout(req, res, next) {
  try {
    if (!req.session.usuario) {
      return res.status(400).json({ ok: false, mensaje: "No hay sesion activa" });
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.json({ ok: true, mensaje: "Sesion cerrada correctamente" });
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