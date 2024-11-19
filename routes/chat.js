const express = require("express");
const router = express.Router();
const chatbot = require('../config/chatbot');

router.get("/", (req, res) => {
  res.render("chat"); 
});

router.post("/", (req, res) => {
  const userMsg = req.body.msg; // Mensaje enviado por el usuario
  const session = req.session; // Sesión actual

  try {
    console.log("Mensaje recibido del cliente:", userMsg); // Log para confirmar el mensaje recibido
    const response = chatbot.handleMessage(userMsg, session); // Respuesta del bot
    console.log("Respuesta del bot:", response.reply); // Log para confirmar la respuesta
    res.json({ reply: response.reply, options: response.options || [] });
  } catch (error) {
    console.error("Error en el chatbot:", error.message);
    res.status(500).json({ error: "Algo salió mal con el chatbot." });
  }
});

module.exports = router;
