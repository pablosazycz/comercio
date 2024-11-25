const Producto = require("../models/Producto");

exports.getAllProducts = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }

  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      error: "No tienes permisos para ver las categorías",
    });
  }
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      error: "No tienes permisos para ver las categorías",
    });
  }
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      error: "No tienes permisos para ver las categorías",
    });
  }
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
