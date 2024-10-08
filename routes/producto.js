const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { isAdmin } = require('../middlewares/auth');

router.get('/crear', isAdmin, productoController.createProductoView);

router.post('/crear', isAdmin, productoController.createProducto);

router.get("/", productoController.getAllProductos);

router.get('/:id', productoController.getProductoById);

router.get('/editar/:id', isAdmin, productoController.updateProductoView);

router.post('/editar/:id',isAdmin, productoController.updateProducto);

router.post('/eliminar/:id',isAdmin,productoController.deleteProducto);

router.get('/categoria/:categoria', productoController.getProductsByCategory);

module.exports = router;