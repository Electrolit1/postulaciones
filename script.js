// ⚠️ Usa "discord.com" en tu webhook
const WEBHOOK_URL = "https://discord.com/api/webhooks/1414057629826810007/ymOwrWSZwKGtYvmHcgURta1JGjkV6MlNgylik2NLjA1SDN1pWr8h2EKGSD7qzRgxNmKn";

let postulacionesAbiertas = true;
let yaPostulado = localStorage.getItem("yaPostulado") === "true";

// Si ya postuló, mostrar pantalla final al cargar
if (yaPostulado) {
  mostrarPantallaFinal("⚠️ Ya enviaste una postulación. Solo puedes enviar una vez.");
}

document.getElementById("postulacionForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!postulacionesAbiertas) {
    mostrarPantallaFinal("🚫 Las postulaciones están cerradas actualmente.");
    return;
  }

  if (yaPostulado) {
    mostrarPantallaFinal("⚠️ Ya enviaste una postulación. Solo puedes enviar una vez.");
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
      yaPostulado = true;
      localStorage.setItem("yaPostulado", "true");
      mostrarPantallaFinal("✅ Gracias por tu postulación. Solo puedes enviar una vez.");
    } else {
      mostrarPantallaFinal("❌ Error al enviar la postulación. Intenta más tarde.");
    }
  } catch (error) {
    mostrarPantallaFinal("❌ Error de conexión. Intenta nuevamente.");
  }
});

// Panel admin
document.getElementById("togglePostulaciones")?.addEventListener("click", () => {
  postulacionesAbiertas = !postulacionesAbiertas;
  document.getElementById("estadoPostulaciones").textContent = postulacionesAbiertas
    ? "✅ Postulaciones abiertas"
    : "🚫 Postulaciones cerradas";
  document.getElementById("togglePostulaciones").textContent = postulacionesAbiertas
    ? "Cerrar Postulaciones"
    : "Abrir Postulaciones";
});

document.getElementById("resetPostulaciones")?.addEventListener("click", () => {
  yaPostulado = false;
  localStorage.removeItem("yaPostulado");
  location.reload(); // recargar página para mostrar formulario otra vez
});

// Función para mostrar pantalla final
function mostrarPantallaFinal(mensaje) {
  document.body.innerHTML = `
    <div style="
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      height:100vh;
      background:#111;
      color:#fff;
      font-family:Arial, sans-serif;
      text-align:center;
      padding:20px;">
      <h1>${mensaje}</h1>
      <p>🔒 No puedes volver a enviar otra postulación hasta que el administrador lo permita.</p>
    </div>
  `;
}
