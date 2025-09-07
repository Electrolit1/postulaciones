// ⚠️ Tu webhook de Discord (usa discord.com)
const WEBHOOK_URL = "https://discord.com/api/webhooks/1414057629826810007/ymOwrWSZwKGtYvmHcgURta1JGjkV6MlNgylik2NLjA1SDN1pWr8h2EKGSD7qzRgxNmKn";

let postulacionesAbiertas = true;

// Revisar si ya postuló en el navegador
let yaPostulado = localStorage.getItem("yaPostulado") === "true";

// Actualizar estado inicial
if (yaPostulado) {
  document.getElementById("estado").textContent = "⚠️ Ya enviaste una postulación.";
}

document.getElementById("postulacionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado");

  if (!postulacionesAbiertas) {
    estado.textContent = "🚫 Las postulaciones están cerradas.";
    return;
  }

  if (yaPostulado) {
    estado.textContent = "⚠️ Ya enviaste una postulación.";
    return;
  }

  const usuario = document.getElementById("usuario").value;
  const edad = document.getElementById("edad").value;
  const motivo = document.getElementById("motivo").value;

  const payload = {
    embeds: [
      {
        title: "📋 Nueva Postulación",
        color: 0xe63946,
        fields: [
          { name: "👤 Usuario", value: usuario, inline: true },
          { name: "🎂 Edad", value: edad, inline: true },
          { name: "📝 Motivo", value: motivo }
        ],
        footer: { text: "Servidor Minecraft" },
        timestamp: new Date()
      }
    ]
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      estado.textContent = "✅ Postulación enviada con éxito.";
      yaPostulado = true;
      localStorage.setItem("yaPostulado", "true"); // Guardar en navegador
    } else {
      estado.textContent = "❌ Error al enviar.";
    }
  } catch (error) {
    estado.textContent = "❌ Error de conexión.";
  }
});

// Panel admin
document.getElementById("togglePostulaciones").addEventListener("click", () => {
  postulacionesAbiertas = !postulacionesAbiertas;
  document.getElementById("estadoPostulaciones").textContent = postulacionesAbiertas
    ? "✅ Postulaciones abiertas"
    : "🚫 Postulaciones cerradas";
  document.getElementById("togglePostulaciones").textContent = postulacionesAbiertas
    ? "Cerrar Postulaciones"
    : "Abrir Postulaciones";
});

document.getElementById("resetPostulaciones").addEventListener("click", () => {
  yaPostulado = false;
  localStorage.removeItem("yaPostulado"); // Permitir de nuevo
  document.getElementById("estado").textContent = "🔄 Postulaciones reiniciadas, puedes enviar de nuevo.";
});
