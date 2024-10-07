const Categoria = require("../models/Categoria");
const Producto = require("../models/Producto");

exports.createCategoria = async (req, res) => {
  const nuevaCategoria = new Categoria({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  });

  try {
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

