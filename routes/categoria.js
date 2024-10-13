const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const { isAdmin } = require("../middlewares/auth");


router.get('/crear',isAdmin, categoriaController.createCategoriesViews);

router.post('/crear',isAdmin, categoriaController.createCategories);

router.get('/editar/:id',isAdmin, categoriaController.updateCategoryView);

router.post('/editar/:id',isAdmin, categoriaController.updateCategory);

router.post('/eliminar/:id', isAdmin, categoriaController.deleteCategory);

router.get('/',categoriaController.getAllCategories);
module.exports = router;

