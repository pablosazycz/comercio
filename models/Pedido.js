const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  productos: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  fechaPedido: {
    type: Date,
    default: Date.now,
  },
  fechaEntrega: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "entregado", "cancelado", "en camino"],
    default: "pendiente",
  },
  pagado: {
    type: Boolean,
    default: false,
  },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);
module.exports = Pedido;
