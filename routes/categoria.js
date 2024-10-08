const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const { isAdmin } = require("../middlewares/auth");


router.get('/',categoriaController.getAllCategories);

router.get('/crear',isAdmin, categoriaController.createCategoriesViews);

router.post('/crear',isAdmin, categoriaController.createCategories);

router.post('/eliminar/:id', isAdmin, categoriaController.deleteCategory);

module.exports = router;

