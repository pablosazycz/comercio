const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");
const { isAdmin } = require("../middlewares/auth");


router.get('/',categoriaController.getAllCategories);

router.get('/crear',isAdmin, categoriaController.createCategoriesViews);

router.post('/crear',isAdmin, categoriaController.createCategories);

module.exports = router;