const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");

exports.createProductoView = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    const title ='Crear Producto' // Obtiene las categorías
    res.render("producto/crear", { categorias, title }); // Pasa las categorías a la vista
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProducto = async (req, res) => {
  console.log(req.body); // Verifica qué datos llegan
  const nuevoProducto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
  });

  try {
    await nuevoProducto.save();
    res.redirect("/producto/vista");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find(); // Obtiene todos los productos
    const categorias = await Categoria.find(); // Obtiene las categorías
    // Mostrar en la consola
    const title = "Lista de Productos";
    console.log(title);
    console.log("Productos:", productos);
    console.log("Categorías:", categorias);
    res.render("producto/vista", {title, productos, categorias }); // Pasa los productos y las categorías a la vista
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
