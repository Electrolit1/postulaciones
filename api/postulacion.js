export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { usuario, edad, motivo } = req.body;

  if (!usuario || !edad || !motivo) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK;

  const payload = {
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
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Error enviando a Discord");
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
