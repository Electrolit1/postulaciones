const form = document.getElementById("postulacionForm");
const estado = document.getElementById("estado");
const toggleBtn = document.getElementById("togglePostulaciones");
const resetBtn = document.getElementById("resetPostulaciones");
const estadoPostulaciones = document.getElementById("estadoPostulaciones");

// URL de tu API en Vercel
const BACKEND_URL = "/api/postulacion";

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
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, edad, motivo })
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
