const express = require("express");
const router = express.Router();
const chatbot = require('../config/chatbot');
const {ensureAuthenticated} = require('../middlewares/auth');
const {isCliente} = require('../middlewares/auth');


router.get("/", isCliente,(req, res) => {
  res.render("chat"); 
});

router.post("/",isCliente, (req, res) => {
  const userMsg = req.body.msg; 
  const session = req.session; 
  try {   
    const response = chatbot.handleMessage(userMsg, session); // Respuesta del bots    
    res.json({ reply: response.reply, options: response.options || [] });
  } catch (error) {
    console.error("Error en el chatbot:", error.message);
    res.status(500).json({ error: "Algo salió mal con el chatbot." });
  }
});

module.exports = router;
