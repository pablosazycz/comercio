const socket = io();
socket.emit("join_type", "client");

// Verificar si la conexión fue exitosa
socket.on("connect", () => {
  console.log("Conectado al servidor de WebSocket");
});

// Escuchar mensajes del servidor
socket.on("mensaje", (msg) => {
  console.log("Mensaje recibido:", msg);
  mostrarMensaje(msg);  // Mostrar el mensaje del chatbot
});

// Escuchar las opciones del chatbot
socket.on("opciones", (opciones) => {
  console.log("Opciones del bot:", opciones);
  mostrarOpciones(opciones);  // Mostrar las opciones que el bot envía
});

// Función para mostrar los mensajes en el chat
function mostrarMensaje(msg) {
    const mensajes = document.getElementById("mensajes");
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.classList.add("mensaje");
    nuevoMensaje.textContent = msg;
    mensajes.appendChild(nuevoMensaje);
    mensajes.scrollTop = mensajes.scrollHeight; // Desplazar el scroll hacia abajo
  }

// Función para mostrar las opciones del chatbot
function mostrarOpciones(opciones) {
    const botones = document.getElementById("botones");
    botones.innerHTML = ''; // Limpia los botones anteriores
  
    opciones.forEach(opcion => {
      const boton = document.createElement("button");
      const buttonText = typeof opcion.text === 'object' ? (opcion.text.text || "") : opcion.text;
      boton.textContent = buttonText;
      const url = typeof opcion.text === 'object' ? (opcion.text.url || "") : opcion.url;

      if (url) {
        console.log("Redirigiendo a:", url);
        boton.onclick = () => window.location.assign(url);
      } else {
          boton.onclick = () => sendMessage(null, buttonText); // Llama a sendMessage con el texto
          console.log("Enviando mensaje:", buttonText);
      }
  
      boton.classList.add("btn", "btn-secondary");
      botones.appendChild(boton);
    });
  }
  

// Función para enviar el mensaje al servidor (cuando el usuario escribe algo)
function sendMessage(event, message = null) {
    if (event) {
      event.preventDefault(); // Evita recargar la página
    }
  
    let textToSend;
  
    // Si es un evento de formulario, tomamos el texto del input
    if (message === null) {
      const input = document.getElementById("mensajeInput");
      textToSend = input.value.trim();
      input.value = ""; // Limpia el campo de entrada
    } else {
      // Si es un mensaje desde un botón, lo usamos directamente
      textToSend = message.trim();
    }
  
    if (textToSend) {
      socket.emit("mensaje", textToSend); // Enviamos el mensaje al servidor
    } else {
      console.error("No se puede enviar un mensaje vacío.");
    }
  }
  