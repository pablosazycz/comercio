const express = require("express");
const router = express.Router();
const apiCategoriaController = require("../controllers/apiCategoriaController");
const {isAdmin} = require('../middlewares/auth');

router.get("/categorias", apiCategoriaController.getAllCategories);

router.post("/categorias",isAdmin, apiCategoriaController.createCategories);

router.get("/categorias/:id", apiCategoriaController.getCategoryById);

router.put("/categorias/:id",isAdmin, apiCategoriaController.updateCategory);

router.delete("/categorias/:id",isAdmin, apiCategoriaController.deleteCategory);

module.exports = router;