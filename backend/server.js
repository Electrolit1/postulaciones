import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ⚠️ Pega tu webhook aquí
const WEBHOOK_URL = "https://discord.com/api/webhooks/TU_WEBHOOK";
const ROLE_ID = "123456789012345678"; // ID del rol a mencionar

app.post("/postulacion", async (req, res) => {
  const { usuario, edad, motivo } = req.body;

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
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return res.status(500).json({ ok: false, error: "Error enviando a Discord" });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend escuchando en puerto ${PORT}`));
