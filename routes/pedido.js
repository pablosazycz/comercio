const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.post('/procesarPago', ensureAuthenticated, pedidoController.procesarPago);


router.get('/detalles/:id',ensureAuthenticated, pedidoController.detallesPedido);

router.get('/misPedidos',ensureAuthenticated, pedidoController.verMisPedidos);

// router.get('/:id', pedidoController.verPedido);

module.exports = router;

