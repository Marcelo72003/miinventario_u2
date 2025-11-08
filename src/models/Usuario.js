const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "Minimo 2 caracteres"],
      maxlength: [100, "Maximo 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Correo no válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "Minimo 6 caracteres"],
    },
    rol: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario",
    },
  },
  { timestamps: true }
);

module.exports = model("Usuario", usuarioSchema);
