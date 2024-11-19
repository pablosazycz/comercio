const { Server } = require("socket.io");
const chatbot = require("./chatbot");

const operators = []; // Lista de operadores conectados
const clientsWaiting = new Set(); // Lista de clientes esperando soporte

module.exports = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`Nueva conexión: ${socket.id}`);

    // Identificar si es cliente u operador
    socket.on("join_type", (type) => {
      if (type === "client") {
        // Registrar cliente
        console.log(`Cliente registrado: ${socket.id}`);
        socket.emit("mensaje", "¡Hola desde el cliente!");
        clientsWaiting.add(socket.id); // Agregar cliente a la lista de espera
        emitClientList(); // Emitir lista de clientes actualizada
      } else if (type === "operator") {
        // Registrar operador
        operators.push(socket);
        console.log(`Operador conectado: ${socket.id}`);
        socket.emit("mensaje", "Conectado como operador de soporte.");
        emitClientList(); // Enviar lista de clientes en espera
      }
    });

 // Manejo de mensajes del cliente
// Manejo de mensajes del cliente
socket.on("mensaje", (msg) => {
  console.log(`Mensaje recibido de ${socket.id}: ${msg}`);

  // Verificar si el cliente está solicitando soporte
  if (msg.toLowerCase().includes("soporte")) {
    const availableOperator = operators.find(operator => operator.connected); // Primer operador disponible
    if (availableOperator) {
      // Asignar al operador disponible
      availableOperator.emit("mensaje", `Nuevo cliente conectado: ${socket.id}`);
      availableOperator.emit("mensaje", `Mensaje del cliente: ${msg}`);
      socket.emit("mensaje", "Te hemos transferido a soporte.");

      // Asignar cliente al operador
      availableOperator.clientId = socket.id;  // Establecer el cliente al operador

      // Enviar lista de clientes en espera actualizada
      emitClientList();

      // Eliminar cliente de la lista de espera solo después de asignarle un operador
      clientsWaiting.delete(socket.id);
    } else {
      socket.emit("mensaje", "No hay operadores disponibles en este momento.");
    }
    return;
  }

  // Si el cliente ya está en soporte, reenviar solo a ese operador
  const assignedOperator = operators.find(operator => operator.clientId === socket.id);
  if (assignedOperator) {
    assignedOperator.emit("mensaje", `Cliente (${socket.id}): ${msg}`);
  } else {
    // Responder con el chatbot si no hay operador asignado
    const botResponse = chatbot.handleMessage(msg, { conversationState: "inicio" });
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

      // Eliminar operador si es uno
      const operatorIndex = operators.findIndex((op) => op.id === socket.id);
      if (operatorIndex !== -1) {
        operators.splice(operatorIndex, 1);
        console.log(`Operador desconectado: ${socket.id}`);
      }

      // Eliminar cliente de la lista de espera
      clientsWaiting.delete(socket.id);
      emitClientList(); // Emitir lista de clientes actualizada
    });
  });

 // Emitir la lista de clientes en espera a los operadores
function emitClientList() {
  // Enviar la lista de clientes en espera a todos los operadores
  operators.forEach(operator => {
    operator.emit("client_list", Array.from(clientsWaiting)); // Convertir el Set en un Array
  });
}


  return io;
};
