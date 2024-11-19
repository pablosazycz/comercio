const responses = {
  saludo: [
    "Hola, ¿en qué puedo ayudarte?",
    "¡Hola! ¿En qué puedo ayudarte?",
    "¡Hola! ¿Cómo estás?",
  ],
  despedida: ["¡Hasta luego!", "¡Adiós!", "¡Nos vemos!"],
  comoEstas: [
    "¡Estoy bien! ¿Y tú?",
    "¡Estoy bien! ¿En qué puedo ayudarte?",
    "¡Estoy bien! ¿Qué tal tú?",
  ],
};

const saludoOpciones = [
  { text: "Ver productos", url: "/producto" },
  { text: "Ver carrito", url: "/carro/ver" },
  { text: "Hablar con soporte" },
  { text: "Ver categorias", url: "/categorias" },
  { text: "Ver mis pedidos", url: "/pedido/misPedidos" },
  { text: "Cerrar sesion", url: "/usuarios/logout" },
];

const generarOpciones = (opciones) => {
  return opciones.map((opcion) => ({ text: opcion.text, url: opcion.url || null }));
};

module.exports = {
  handleMessage: (userMsg, session) => {
    console.log("Mensaje recibido:", userMsg);

    if (typeof userMsg !== 'string') {
      userMsg = String(userMsg);  // Convertir a string
    }

    let botResponse = "Lo siento, no entiendo tu pregunta";

    if (!session.conversationState) {
      session.conversationState = "inicio"; // Inicializar el estado de la conversación si no existe
    }

    if (userMsg === "Hablar con soporte") {
      session.conversationState = "soporte"; // Cambiar el estado a soporte
      console.log("Estado actualizado a soporte:", session);
      return { reply: "Te hemos transferido a soporte. Por favor espera un momento." };
    }

    if (session.conversationState === "soporte") {
      return { reply: null };  // No respondemos como bot cuando el estado es "soporte"
    }

    const normalizedMsg = userMsg.toLowerCase();

    if (
      normalizedMsg.includes("hola") ||
      normalizedMsg.includes("buenas")
    ) {
      botResponse =
        responses.saludo[Math.floor(Math.random() * responses.saludo.length)];
      session.conversationState = "saludo";

      const opciones = generarOpciones(saludoOpciones);
      return { reply: botResponse, options: opciones };
    } else if (
      normalizedMsg.includes("adios") ||
      normalizedMsg.includes("chau") ||
      normalizedMsg.includes("hasta luego")
    ) {
      botResponse =
        responses.despedida[Math.floor(Math.random() * responses.despedida.length)];
      session.conversationState = "despedida";
    } else if (normalizedMsg.includes("como estas")) {
      botResponse =
        responses.comoEstas[Math.floor(Math.random() * responses.comoEstas.length)];
    } else if (
      session.conversationState === "saludo" &&
      saludoOpciones.some(opcion => opcion.text.toLowerCase() === userMsg.toLowerCase())
    ) {
      botResponse = `Has elegido: ${userMsg}. ¿Cómo puedo ayudarte con esto?`;
      session.conversationState = "opcion_elegida"; // Actualizar el estado de la conversación
    }

    return { reply: botResponse };
  },
};
