const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defino el schema del usuario
const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
  rol: {
    type: String,
    enum: ["cliente", "admin"],
    default: "cliente",
  },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
