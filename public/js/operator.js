// Conexión al servidor de sockets
const socket = io();

// Emitir evento para identificar al operador cuando se conecta
socket.emit("join_type", "operator");

// Escuchar los mensajes que vienen del cliente asignado
socket.on("mensaje", (msg) => {
  console.log(`Mensaje recibido del cliente: ${msg}`);
  displayMessage(`Cliente: ${msg}`); // Mostrar el mensaje en la interfaz de usuario
});

// Escuchar la lista de clientes en espera de soporte
socket.on("client_list", (clients) => {
  console.log("Clientes en espera: ", clients);
  updateClientList(clients); // Actualizar la lista de clientes en espera en la UI
});

// Función para mostrar los mensajes del cliente en la UI
function displayMessage(message) {
  const messageContainer = document.getElementById("chatMessages");
  messageContainer.innerHTML += `<div>${message}</div>`;  // Añadir el mensaje al contenedor de mensajes
}

// Función para actualizar la lista de clientes en espera en la UI
function updateClientList(clients) {
  const clientListContainer = document.getElementById("clientList");
  clientListContainer.innerHTML = ""; // Limpiar la lista antes de actualizarla

  // Crear un elemento de lista por cada cliente en espera
  clients.forEach(client => {
    const clientElement = document.createElement("li");
    clientElement.textContent = `Cliente: ${client}`;  // Mostrar el ID del cliente
    clientElement.onclick = () => assignClient(client); // Asignar al cliente cuando se hace clic
    clientListContainer.appendChild(clientElement);
  });
}

// Función para asignar un cliente al operador
function assignClient(clientId) {
  console.log(`Asignando cliente: ${clientId}`);
  document.getElementById("selectedClientId").value = clientId; // Guardar el ID del cliente seleccionado

  // Enviar un mensaje de bienvenida al cliente
  socket.emit("operator_message", {
    clientId: clientId,
    mensaje: "¡Hola! Soy tu operador de soporte.",  // Mensaje de bienvenida
  });

  // Mostrar en la UI que la conversación ha comenzado
  displayMessage(`Conectado con el cliente: ${clientId}`);
}

// Función para enviar un mensaje al cliente seleccionado
function sendMessage() {
  const message = document.getElementById("messageInput").value;  // Obtener el mensaje del input
  const clientId = document.getElementById("selectedClientId").value;  // Obtener el ID del cliente seleccionado

  if (!clientId) {
    alert("Selecciona un cliente antes de enviar el mensaje.");
    return;  // Si no hay cliente seleccionado, no enviar el mensaje
  }

  console.log(`Enviando mensaje al cliente ${clientId}: ${message}`);
  socket.emit("operator_message", { clientId: clientId, mensaje: message });  // Enviar el mensaje al cliente

  // Mostrar el mensaje en la UI
  displayMessage(`Operador: ${message}`);

  // Limpiar el campo de entrada de mensaje
  document.getElementById("messageInput").value = "";
}

// Función para cerrar la conversación con el cliente
function closeConversation() {
  const clientId = document.getElementById("selectedClientId").value;

  if (!clientId) {
    alert("No hay cliente seleccionado.");
    return;  // Si no hay cliente seleccionado, no cerrar la conversación
  }

  console.log(`Cerrando conversación con el cliente ${clientId}`);
  socket.emit("close_conversation", clientId);  // Emitir evento para cerrar la conversación

  // Notificar al cliente que la conversación ha sido cerrada
  socket.emit("mensaje", "La conversación ha sido cerrada por el operador.");

  // Limpiar la UI de la conversación
  document.getElementById("chatMessages").innerHTML = "";
  document.getElementById("selectedClientId").value = "";  // Limpiar el ID del cliente seleccionado
}
