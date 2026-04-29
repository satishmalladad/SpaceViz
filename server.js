require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// ── SERVE STATIC FILES ────────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ── AI STYLE DETECTION ────────────────────────────────────
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.json({ style: "modern" });

    const base64 = req.file.buffer.toString("base64");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-11b-vision-instruct",
        messages: [
          { role: "system", content: 'Return ONLY JSON like {"style":"modern"}. Style must be one of: modern, luxury, organic, industrial' },
          { role: "user", content: [
            { type: "text", text: "Detect the interior design style of this room." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } }
          ]}
        ]
      })
    });

    const text = await response.text();
    let parsed = { style: "modern" };
    try {
      const data = JSON.parse(text);
      const content = data?.choices?.[0]?.message?.content || "";
      const match = content.match(/\{.*\}/s);
      if (match) parsed = JSON.parse(match[0]);
    } catch(e) {}

    res.json(parsed);

  } catch (err) {
    console.error("Analyze Error:", err);
    res.json({ style: "modern" });
  }
});

// ── ROOM IMAGE GENERATION ─────────────────────────────────
app.post("/api/generate-room", async (req, res) => {
  try {
    const { style } = req.body;

    const styleImages = {
      modern: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800"
      ],
      luxury: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
      ],
      organic: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d61?w=800"
      ],
      industrial: [
        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
      ]
    };

    const images = styleImages[style] || styleImages["modern"];
    const image = images[Math.floor(Math.random() * images.length)];

    await new Promise(r => setTimeout(r, 800));

    res.json({ image });

  } catch (err) {
    console.error("Generate Error:", err);
    res.json({ image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800" });
  }
});

// ── CATCH ALL → serve index.html ─────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ── START ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RoomVerse running → http://localhost:${PORT}`);
});

module.exports = app;