const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const carroSchema = new Schema({
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
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
        enum: ["pendiente", "pagado","cancelado","completo"],
        default: "pendiente",
    },
});

const Carro = mongoose.model("Carro", carroSchema);

module.exports = Carro;