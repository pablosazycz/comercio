const { Server } = require("socket.io");
const chatbot = require("./chatbot");

const operators = [];
const clientsWaiting = new Set();

module.exports = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`Nueva conexión: ${socket.id}`);

    // Identificar si es cliente u operador
    socket.on("join_type", (type) => {
      if (type === "client") {
        clientsWaiting.add(socket.id);
        emitClientList();
      } else if (type === "operator") {
        operators.push(socket);
        emitClientList(); // Enviar lista de clientes en espera
      }
    });

    // Manejo de mensajes del cliente
    socket.on("mensaje", (msg) => {
      console.log(`Mensaje recibido de ${socket.id}: ${msg}`);

      if (msg.toLowerCase().includes("soporte")) {
        const availableOperator = operators.find(
          (operator) => operator.connected
        );
        if (availableOperator) {
          availableOperator.emit(
            "mensaje",
            `Nuevo cliente conectado: ${socket.id}`
          );
          availableOperator.emit("mensaje", `Mensaje del cliente: ${msg}`);
          socket.emit("mensaje", "Te hemos transferido a soporte.");
          availableOperator.clientId = socket.id;
          emitClientList();
          clientsWaiting.delete(socket.id);
        } else {
          socket.emit(
            "mensaje",
            "No hay operadores disponibles en este momento."
          );
        }
        return;
      }

      // Si el cliente ya está en soporte, reenviar solo a ese operador
      const assignedOperator = operators.find(
        (operator) => operator.clientId === socket.id
      );
      if (assignedOperator) {
        assignedOperator.emit("mensaje", `Cliente (${socket.id}): ${msg}`);
      } else {
        // Responder con el chatbot si no hay operador asignado
        const botResponse = chatbot.handleMessage(msg, {
          conversationState: "inicio",
        });
        if (botResponse.reply) {
          socket.emit("mensaje", botResponse.reply);
        }
        if (botResponse.options) {
          socket.emit("opciones", botResponse.options); // Enviar las opciones al cliente
        }
      }
    });

    // Manejo de mensajes del operador
    socket.on("operator_message", (data) => {
      const { mensaje, clientId } = data;
      const clientSocket = io.sockets.sockets.get(clientId);

      if (clientSocket) {
        clientSocket.emit("mensaje", `Soporte: ${mensaje}`);
        console.log(`Mensaje enviado al cliente ${clientId}: ${mensaje}`);
      } else {
        socket.emit("mensaje", "El cliente no está disponible.");
      }
    });

    // Manejo de la desconexión del cliente o operador
    socket.on("disconnect", () => {
      console.log(`Socket desconectado: ${socket.id}`);

      const operatorIndex = operators.findIndex((op) => op.id === socket.id);
      if (operatorIndex !== -1) {
        operators.splice(operatorIndex, 1);
        console.log(`Operador desconectado: ${socket.id}`);
      }
      clientsWaiting.delete(socket.id);
      emitClientList();
    });
  });

  function emitClientList() {
    operators.forEach((operator) => {
      operator.emit("client_list", Array.from(clientsWaiting));
    });
  }

  return io;
};
