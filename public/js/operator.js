// Conexión al servidor de sockets
const socket = io();
socket.emit("join_type", "operator");

// Escuchar los mensajes que vienen del cliente 
socket.on("mensaje", (msg) => {
  displayMessage(`${msg}`); // Mostrar el mensaje en la interfaz de usuario
});

//lista de clientes en espera de soporte
socket.on("client_list", (clients) => {
  updateClientList(clients);
});

// Función para mostrar los mensajes
function displayMessage(message) {
  const messageContainer = document.getElementById("chatMessages");
  messageContainer.innerHTML += `<div>${message}</div>`; 
}

// Función para actualizar la lista de clientes
function updateClientList(clients) {
  const clientListContainer = document.getElementById("clientList");
  clientListContainer.innerHTML = ""; 

  // Crear un elemento de lista por cada cliente en espera
  clients.forEach(client => {
    const clientElement = document.createElement("li");
    clientElement.textContent = `Cliente: ${client}`;  // Mostrar el ID del cliente
    clientElement.className = "list-group-item list-group-item-action";
    clientElement.style.cursor = "pointer";
    clientElement.onclick = () => assignClient(client); // Asignar al cliente cuando se hace clic
    clientListContainer.appendChild(clientElement);
  });
}

// Función para asignar un cliente al operador
function assignClient(clientId) {
  console.log(`Asignando cliente: ${clientId}`);
  document.getElementById("selectedClientId").value = clientId; // Guardar el ID del cliente seleccionado

  socket.emit("operator_message", {
    clientId: clientId,
    mensaje: "¡Hola! Soy tu operador de soporte.",  // Mensaje de bienvenida
  });

  displayMessage(`Conectado con el cliente: ${clientId}`);
}

// Función para enviar un mensaje al cliente seleccionado
function sendMessage() {
  const message = document.getElementById("messageInput").value; 
  const clientId = document.getElementById("selectedClientId").value;

  if (!clientId) {
    alert("Selecciona un cliente antes de enviar el mensaje.");
    return;  
  }

  socket.emit("operator_message", { clientId: clientId, mensaje: message });  // Enviar el mensaje al cliente

  displayMessage(`Operador: ${message}`);

  document.getElementById("messageInput").value = "";
}

// Función para cerrar la conversación con el cliente
function closeConversation() {
  const clientId = document.getElementById("selectedClientId").value;

  if (!clientId) {
    alert("No hay cliente seleccionado.");
    return; 
  }
  socket.emit("close_conversation", clientId);  
  socket.emit("mensaje", "La conversación ha sido cerrada por el operador.");

  document.getElementById("chatMessages").innerHTML = "";
  document.getElementById("selectedClientId").value = ""; 
}
