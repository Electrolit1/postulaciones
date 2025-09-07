const form = document.getElementById("postulacionForm");
const estado = document.getElementById("estado");
const toggleBtn = document.getElementById("togglePostulaciones");
const resetBtn = document.getElementById("resetPostulaciones");
const estadoPostulaciones = document.getElementById("estadoPostulaciones");

// ⚠️ Webhook y rol
const WEBHOOK_URL = "https://discord.com/api/webhooks/TU_WEBHOOK";
const ROLE_ID = "123456789012345678";

// Estado de postulaciones
let abiertas = localStorage.getItem("postulacionesAbiertas") !== "false";

// Bloquear si ya postuló
let yaPostulo = localStorage.getItem("postulacionEnviada");

// Mostrar estado inicial
form.style.display = abiertas && !yaPostulo ? "block" : "none";
estadoPostulaciones.textContent = abiertas ? "✅ Postulaciones abiertas" : "❌ Postulaciones cerradas";
toggleBtn.textContent = abiertas ? "Cerrar Postulaciones" : "Abrir Postulaciones";

if (yaPostulo) {
  form.style.display = "none";
  estado.textContent = "Ya enviaste tu postulación. Espera la respuesta del staff.";
}

// Enviar formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!abiertas) {
    estado.textContent = "❌ Las postulaciones están cerradas.";
    return;
  }

  const usuario = document.getElementById("usuario").value;
  const edad = document.getElementById("edad").value;
  const motivo = document.getElementById("motivo").value;

  const payload = {
    content: `<@&${ROLE_ID}>`,
    embeds: [
      {
        title: "📋 Nueva Postulación",
        color: 0xE63946,
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
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    localStorage.setItem("postulacionEnviada", "true");
    form.style.display = "none";
    estado.textContent = "✅ Postulación enviada correctamente.";
  } catch (error) {
    estado.textContent = "❌ Error al enviar la postulación.";
    console.error("Error:", error);
  }
});

// Abrir/cerrar postulaciones
toggleBtn.addEventListener("click", () => {
  abiertas = !abiertas;
  localStorage.setItem("postulacionesAbiertas", abiertas);

  form.style.display = abiertas && !yaPostulo ? "block" : "none";
  estadoPostulaciones.textContent = abiertas ? "✅ Postulaciones abiertas" : "❌ Postulaciones cerradas";
  toggleBtn.textContent = abiertas ? "Cerrar Postulaciones" : "Abrir Postulaciones";
});

// Reiniciar postulaciones (permite volver a enviar)
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("postulacionEnviada");
  yaPostulo = false;

  if (abiertas) {
    form.style.display = "block";
    estado.textContent = "📢 Se han reiniciado las postulaciones, puedes volver a enviar.";
  } else {
    estado.textContent = "⚠️ Postulaciones reiniciadas, pero están cerradas.";
  }
});
