var express = require('express');
var router = express.Router();
const { ensureAuthenticated, isAdmin, isCliente } = require('../middlewares/auth');

const chatCliente='Para contactar con nosotros, por favor entre a nuestro ChatBot. Para entrar a él haga click en la imagen de abajo, escriba hola y este le dará las opciones a elegir.'
const chatSoporte='Entra al chatbot a dar soporte a nuestros clientes'

// Ruta para administradores
router.get('/admin', ensureAuthenticated, isAdmin, (req, res) => {
  res.render('contacto', { title: 'Soporte', link: '/soporte',text:chatSoporte});
});

// Ruta para clientes
router.get('/cliente', ensureAuthenticated, isCliente, (req, res) => {
  res.render('contacto', { title: 'Contactanos', link: '/chat' ,text:chatCliente});
});

// Ruta general con lógica condicional
router.get('/', ensureAuthenticated, (req, res) => {
  if (req.user.rol === 'admin') {
    return res.render('contacto', { title: 'Soporte', link: '/soporte',text:chatSoporte });
  }
  if (req.user.rol === 'cliente') {
    return res.render('contacto', { title: 'Contactanos', link: '/chat',text:chatCliente });
  }
  res.status(403).send('Acceso denegado');
});

module.exports = router;
