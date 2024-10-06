const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defino el schema del producto
const productoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: String,
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  
});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
