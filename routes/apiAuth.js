const express = require('express');
const router = express.Router();
const apiAuthController = require('../controllers/apiAuthController');

router.post('/login', apiAuthController.apiLogin);

module.exports = router;

