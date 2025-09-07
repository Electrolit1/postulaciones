const form = document.getElementById("postulacionForm");
const estado = document.getElementById("estado");
const toggleBtn = document.getElementById("togglePostulaciones");
const resetBtn = document.getElementById("resetPostulaciones");
const estadoPostulaciones = document.getElementById("estadoPostulaciones");

// ❌ Aquí va tu webhook directo (inseguro)
const WEBHOOK_URL = "https://discord.com/api/webhooks/TU_WEBHOOK";

let abiertas = localStorage.getItem("postulacionesAbiertas") !== "false";
let yaPostulo = localStorage.getItem("postulacionEnviada");

form.style.display = abiertas && !yaPostulo ? "block" : "none";
estadoPostulaciones.textContent = abiertas ? "✅ Postulaciones abiertas" : "❌ Postulaciones cerradas";
toggleBtn.textContent = abiertas ? "Cerrar Postulaciones" : "Abrir Postulaciones";

if (yaPostulo) {
  form.style.display = "none";
  estado.textContent = "Ya enviaste tu postulación.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!abiertas) {
    estado.textContent = "❌ Las postulaciones están cerradas.";
    return;
  }

  const usuario = document.getElementById("usuario").value;
  const edad = document.getElementById("edad").value;
  const motivo = document.getElementById("motivo").value;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "📋 Nueva Postulación",
            color: 0xe63946,
            fields: [
              { name: "👤 Usuario", value: usuario, inline: true },
              { name: "🎂 Edad", value: edad.toString(), inline: true },
              { name: "📝 Motivo", value: motivo }
            ],
            footer: { text: "Servidor Minecraft" },
            timestamp: new Date()
          }
        ]
      })
    });

    if (!response.ok) throw new Error("Error en servidor");

    localStorage.setItem("postulacionEnviada", "true");
    form.style.display = "none";
    estado.textContent = "✅ Postulación enviada correctamente.";
  } catch (error) {
    estado.textContent = "❌ Error al enviar.";
    console.error(error);
  }
});

toggleBtn.addEventListener("click", () => {
  abiertas = !abiertas;
  localStorage.setItem("postulacionesAbiertas", abiertas);
  form.style.display = abiertas && !yaPostulo ? "block" : "none";
  estadoPostulaciones.textContent = abiertas ? "✅ Postulaciones abiertas" : "❌ Postulaciones cerradas";
  toggleBtn.textContent = abiertas ? "Cerrar Postulaciones" : "Abrir Postulaciones";
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("postulacionEnviada");
  yaPostulo = false;
  if (abiertas) {
    form.style.display = "block";
    estado.textContent = "📢 Puedes volver a enviar una postulación.";
  }
});
