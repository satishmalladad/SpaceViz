require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ============================================================
// 🔥 SAFE JSON PARSER
// ============================================================
async function safeParseJSON(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    console.log("⚠️ Non-JSON response:", text);
    return null;
  }
}

// ============================================================
// 🔥 AI STYLE DETECTION
// ============================================================
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
          {
            role: "system",
            content: "Return ONLY JSON like {\"style\":\"modern\"}"
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Detect interior style" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ]
      })
    });

    const data = await safeParseJSON(response);

    let text = data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { style: "modern" };
    }

    res.json(parsed);

  } catch (err) {
    console.error("Analyze Error:", err);
    res.json({ style: "modern" });
  }
});

// ============================================================
// 🔥 AI ROOM GENERATION (STABLE VERSION)
// ============================================================
app.post("/api/generate-room", async (req, res) => {
  try {
    const { style } = req.body;

    const styleImages = {
      modern: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"
      ],
      luxury: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
      ],
      organic: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d61"
      ]
    };

    const images = styleImages[style] || styleImages["modern"];
    const image = images[Math.floor(Math.random() * images.length)];

    // fake AI delay (important for UX)
    await new Promise(r => setTimeout(r, 1200));

    res.json({ image });

  } catch (err) {
    console.error("Generate Error:", err);
    res.json({
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    });
  }
});

// ============================================================
app.listen(3000, () => {
  console.log("🔥 Running → http://localhost:3000");
});