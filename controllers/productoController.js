const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");

exports.createProductoView = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.render("producto/crear", { categorias });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProducto = async (req, res) => {
  const nuevoProducto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
  });

  try {
    await nuevoProducto.save();
    res.render("/producto/vista");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createProductoApi = async (req, res) => {
  const nuevoProducto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
  });

  try {
    await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProductosApi = async (req, res) => {
  try {
    const productos = await Producto.find().populate("categoria");
    res.status(200).json({ productos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    const categorias = await Categoria.find();

    res.render("producto/vista", { productos, categorias });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      res.status(404).json({ mensaje: "El producto no existe" });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const prodActualizado = await Producto.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!productoActualizado) {
      return res.status(404).json({ error: "El producto no existe" });
    }
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ error: "El producto no existe" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { categoria } = req.params;
  try {
    const productos = await Producto.find({ categoria: categoria }).populate(
      "categoria"
    );
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
