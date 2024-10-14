const express = require("express");
const router = express.Router();
const apiCategoriaController = require("../controllers/apiCategoriaController");
const {isAdmin} = require('../middlewares/auth');

router.get("/categorias", apiCategoriaController.getAllCategories);

router.post("/categorias", apiCategoriaController.createCategories);

router.get("/categorias/:id", apiCategoriaController.getCategoryById);

router.put("/categorias/:id", apiCategoriaController.updateCategory);

router.delete("/categorias/:id", apiCategoriaController.deleteCategory);

module.exports = router;