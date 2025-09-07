const form = document.getElementById("postulacionForm");
const estado = document.getElementById("estado");
const toggleBtn = document.getElementById("togglePostulaciones");
const estadoPostulaciones = document.getElementById("estadoPostulaciones");

// Estado de postulaciones (true = abiertas)
let abiertas = localStorage.getItem("postulacionesAbiertas") !== "false";

// Bloquear si ya postuló
let yaPostulo = localStorage.getItem("postulacionEnviada");

// Mostrar estado inicial
form.style.display = abiertas ? "block" : "none";
estadoPostulaciones.textContent = abiertas ? "✅ Postulaciones abiertas" : "❌ Postulaciones cerradas";
toggleBtn.textContent = abiertas ? "Cerrar Postulaciones" : "Abrir Postulaciones";

if (yaPostulo) {
  form.style.display = "none";
  estado.textContent = "Ya enviaste tu postulación. Espera la respuesta del staff.";
}

// Enviar formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!abiertas) {
    estado.textContent = "❌ Las postulaciones están cerradas.";
    return;
  }

  // Guardar en localStorage (solo demostración)
  localStorage.setItem("postulacionEnviada", "true");
  form.style.display = "none";
  estado.textContent = "✅ Postulación enviada. Gracias!";
});

// Abrir/cerrar postulaciones (admin)
toggleBtn.addEventListener("click", () => {
  abiertas = !abiertas;
  localStorage.setItem("postulacionesAbiertas", abiertas);

  form.style.display = abiertas && !yaPostulo ? "block" : "none";
  estadoPostulaciones.textContent = abiertas ? "✅ Postulaciones abiertas" : "❌ Postulaciones cerradas";
  toggleBtn.textContent = abiertas ? "Cerrar Postulaciones" : "Abrir Postulaciones";
});
