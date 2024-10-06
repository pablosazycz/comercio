const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/crear', productoController.createProductoView);

router.post('/crear', productoController.createProducto);

router.get("/vista", productoController.getAllProductos);

router.get('/:id', productoController.getProductoById);

router.put('/:id', productoController.updateProducto);

router.delete('/:id', productoController.deleteProducto);

module.exports = router;