const Categoria = require("../models/Categoria");
const Producto = require("../models/Producto");

exports.categoriaView = async (req, res) => {
  try{
    const categorias = await Categoria.find();
    res.render("/categorias", {categorias});
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
};

