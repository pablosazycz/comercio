const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/registro', usuarioController.mostrarRegistro);

router.post('/registro', usuarioController.registerUsuario);

router.get('/login', usuarioController.mostrarLogin);

router.post('/login', usuarioController.iniciarSesion);

router.get('/logout', usuarioController.cerrarSesion);

router.get('/perfil', usuarioController.mostrarPerfil);

module.exports = router;