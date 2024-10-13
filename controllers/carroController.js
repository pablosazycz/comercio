const Carro = require("../models/Carro");

exports.agregarCarro = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para agregar productos al carrito",
    });
  }

  const usuarioId = req.user._id;
  const { productoId, cantidad } = req.body;

  try {
    let carro = await Carro.findOne({ usuario: usuarioId });
    if (!carro) {
      carro = new Carro({
        usuario: usuarioId,
        productos: [],
      });
    }
    const productoExistente = carro.productos.find(
      (p) => p.producto.toString() === productoId
    );

    if (productoExistente) {
      productoExistente.cantidad += parseInt(cantidad);
    } else {
      carro.productos.push({
        producto: productoId,
        cantidad: parseInt(cantidad),
      });
    }
    await carro.save();
    res.redirect("/producto");
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res
      .status(500)
      .json({ error: "Hubo un error al agregar el producto al carrito" });
  }
};

exports.verCarro = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: error.message,
    });
  }
  const usuarioId = req.user._id;

  try {
    let carro = await Carro.findOne({
      usuario: usuarioId,
      estado: "pendiente",
    }).populate("productos.producto");
    if (!carro) {
      return res.render("carro/carro", { carro: { productos: [] } });
    }
    res.render("carro/carro", { carro });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.vaciarCarro = async (req, res) => {
  const usuarioId = req.user._id;

  try {
    let carro = await Carro.findOneAndDelete({
      usuario: usuarioId,
      estado: "pendiente",
    });

    if (!carro) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.redirect("/carro/ver");
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    res.status(500).json({ error: "Hubo un error al eliminar el carrito" });
  }
};

exports.eliminarProducto = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para eliminar productos del carrito",
    });
  }
  const usuarioId = req.user._id;
  const { productoId } = req.body;

  try {
    let carro = await Carro.findOne({ usuario: usuarioId });
    if (!carro) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }

    carro.productos = carro.productos.filter(
      (p) => p.producto.toString() !== productoId
    );

    await carro.save();
    res.redirect("/carro");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Debes iniciar sesión para comprar" });
  }
  const usuarioId = req.user._id;

  try {
    let carro = await Carro.findOne({usuario: usuarioId})
      .populate("productos.producto")
      .populate("usuario");

    if (!carro) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }

    res.render("carro/checkout", {
      usuario: req.user,
      carro: carro,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarCantidadCarro = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Debes iniciar sesión para comprar" });
  }
  const usuarioId = req.user._id;
  const { productoId, nuevaCantidad } = req.body;

  try {
    let carro = await Carro.findOne({ usuario: usuarioId });

    if (!carro) {
      return res.status(404).json({ error: "No se encontró el carrito" });
    }
    const productoExistente = carro.productos.find(
      (p) => p.producto.toString() === productoId
    );

    if (productoExistente) {
      productoExistente.cantidad = parseInt(nuevaCantidad);
      await carro.save();
    } else {
      return res
        .status(404)
        .json({ error: "El producto no está en el carrito" });
    }
    res.redirect("/carro");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
