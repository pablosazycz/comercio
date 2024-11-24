const Categoria = require("../models/Categoria");
const Usuario = require("../models/Usuario");

exports.getAllCategories = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategories = async (req, res) => {
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
    const nuevaCategoria = new Categoria({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
    });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Debes iniciar sesión para acceder a la url",
    });
  }

  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
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
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoria) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
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
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
