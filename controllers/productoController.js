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

  const productos = await Producto.find();
  const categorias = await Categoria.find();

  try {
    await nuevoProducto.save();
    res.redirect("/producto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    const categorias = await Categoria.find();
    const usuario = req.user || null;
    if (!req.user) {
      return res.redirect('/usuarios/login'); 
    }
    res.render("producto/", { productos, categorias, usuario });
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

exports.updateProductoView = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).render("producto/", {
        error: "El producto no existe",
        productos: await Producto.find(),
      });
    }
    const categorias = await Categoria.find();
    res.render("producto/editar", { producto, categorias });
  }
  catch (error) {
    res.status(500).render("producto/", {
      error: "Error al editar el producto",
      productos: await Producto.find(),
    });
  }
}

exports.updateProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    if (!producto) {
      return res.status(404).render("producto/", {
        error: "El producto no existe",
        productos: await Producto.find(),
      });
    }
    res.redirect("/producto/");
  } catch (error) {
    res.status(500).render("producto/", {
      error: "Error al editar el producto",
      productos: await Producto.find(),
    });
  }
};

exports.deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) {
      return res.status(404).render("producto/", {
        error: "El producto no existe",
        productos: await Producto.find(),
      });
    }
    res.redirect("/producto/");
  } catch (error) {
    res.status(500).render("producto/", {
      error: "Error al eliminar el producto",
      productos: await Producto.find(),
    });
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

exports.getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id).populate("categoria");
    res.render("producto/detalle", { producto });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};