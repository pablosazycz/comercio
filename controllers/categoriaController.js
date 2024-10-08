const Categoria = require("../models/Categoria");
const Producto = require("../models/Producto");

exports.getAllCategories = async (req, res) => {
  try{
    const categorias = await Categoria.find();
    console.log(categorias);
    res.render("categorias/index", {categorias});
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
