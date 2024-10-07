const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const {isAdmin} = require('../middlewares/auth');

router.get('/crear',isAdmin, productoController.createProductoView);

router.post('/crear',isAdmin, productoController.createProducto);

router.get("/vista", productoController.getAllProductos);

router.get('/:id', productoController.getProductoById);

router.put('/:id', productoController.updateProducto);

router.delete('/:id', productoController.deleteProducto);

router.get('/categoria/:categoria', productoController.getProductsByCategory);

module.exports = router;