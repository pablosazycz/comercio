const express = require('express');
const router = express.Router();
const carroController = require('../controllers/carroController');
const {ensureAuthenticated} = require('../middlewares/auth');

router.post('/agregar',ensureAuthenticated, carroController.agregarCarro);

router.post('/eliminar/:id', carroController.eliminarProducto);

router.post('/vaciar', carroController.vaciarCarro);

router.post('/editarCantidad', carroController.editarCantidadCarro);

router.post('/checkout', ensureAuthenticated, carroController.checkout);

router.get('/ver', ensureAuthenticated,carroController.verCarro);

module.exports = router;    