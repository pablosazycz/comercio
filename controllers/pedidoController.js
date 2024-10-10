const Pedido = require("../models/Pedido");
const Carro = require("../models/Carro");

exports.verPedido = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para ver tus pedidos",
    });
  }
  const usuarioId = req.user._id;
  const { id } = req.params;
  try {
    const pedido = await Pedido.findOne({
      usuario: usuarioId,
      _id: id,
    }).populate("productos.producto");

    if (!pedido) {
      return res.status(404).json({ error: "El pedido no existe" });
    }

    res.render("pedido", { pedido });
  } catch (error) {
    console.error("Error al ver el pedido:", error);
    res.status(500).json({ error: "Hubo un error al ver el pedido" });
  }
};

exports.procesarPago = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Debes iniciar sesión para comprar" });
  }
  const usuarioId = req.user._id;
  try {
    const { carroId } = req.body;

    const carro = await Carro.findOne({
      _id: carroId,
      usuario: req.user._id,
    }).populate("productos.producto");

    if (!carroId) {
      return res.status(400).json({ error: "Carro no encontrado" });
    }
    carro.estado = "pagado";
    await carro.save();
    const pedido = new Pedido({
      usuario: carro.usuario,
      productos: carro.productos,
      fechaEntrega: new Date().setDate(new Date().getDate() + 3),
      estado: "pendiente",
    });
    await pedido.save();
    await Carro.findOneAndDelete(carro._id);
    res.redirect(`/pedido/detalles/${pedido._id}`);
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({ error: "Hubo un error al procesar el pago" });
  }
};

exports.detallesPedido = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para ver tus pedidos",
    });
  }

  try {
    const pedidoId = req.params.id;

    const pedido = await Pedido.findOne({
      _id: pedidoId,
      usuario: req.user._id,
    }).populate("productos.producto");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.render("pedido/detalles", { pedido });
  } catch (error) {
    console.error("Error al ver el pedido:", error);
    res.status(500).json({ error: "Hubo un error al ver el pedido" });
  }
};

exports.verMisPedidos = async (req, res) => {
  try{
    if(!req.user){
      return res.status(401).json({error: "Debes iniciar sesión para ver tus pedidos"});
    }
    const pedidos = await Pedido.find({ usuario: req.user._id }).populate("productos.producto");

    res.render("pedido/mispedidos", {pedidos: pedidos});
  }catch(error){
    console.error("Error al ver los pedidos:", error);
    res.status(500).json({error: "Hubo un error al ver los pedidos"});
  }
};

