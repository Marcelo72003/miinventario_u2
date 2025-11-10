document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); // usa la sesión automáticamente

  const form = document.getElementById("form-chat");
  const input = document.getElementById("input-mensaje");
  const contenedor = document.getElementById("mensajes");

  // Recibir mensajes del servidor
  socket.on("chat:mensaje", (msg) => {
    const div = document.createElement("div");
    div.classList.add("msg");

    if (msg.sistema) {
      div.classList.add("msg-sistema");
      div.textContent = msg.texto;
    } else {
      div.classList.add("msg-usuario");
      div.innerHTML = `<strong>${msg.usuario}</strong> [${msg.fecha || ""}]: ${msg.texto}`;
    }

    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
  });

  // Enviar mensaje
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    socket.emit("chat:mensaje", texto);
    input.value = "";
  });
});
