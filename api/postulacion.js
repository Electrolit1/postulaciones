export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { usuario, edad, motivo } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK;

  if (!webhookUrl) {
    return res.status(500).json({ error: "Webhook no configurado en Vercel" });
  }

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
      const text = await response.text();
      console.error("Error Discord:", text);
      return res.status(500).json({ error: "Discord respondió con error", detalle: text });
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Excepción:", error);
    res.status(500).json({ error: "Excepción en servidor", detalle: error.message });
  }
}
