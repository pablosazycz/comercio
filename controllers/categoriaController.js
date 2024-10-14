const Categoria = require("../models/Categoria");
const Producto = require("../models/Producto");

exports.getAllCategories = async (req, res) => {
  try{
    const categorias = await Categoria.find();
    const usuario = req.user;
    if (!req.user) {
      return res.redirect('/usuarios/login'); 
    }

    res.render("categorias/index", {categorias,usuario});
    }
  catch(error){
    res.status(500).json({error: error.message});
  }
};

exports.createCategories = async (req, res) => {
  try{
    const nuevaCategoria = new Categoria({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
    });
    await nuevaCategoria.save();
    res.redirect("/categorias");
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

exports.createCategoriesViews = async (req, res) => {
  try{
    res.render("categorias/crear");
  }catch(error){
    res.status(500).json({error: error.message});
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.redirect("/categorias");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategoryView = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    res.render("categorias/editar", { categoria });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateCategory = async (req, res) => {
  try {
    await Categoria.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/categorias");
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}
