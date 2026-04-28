# 🏠 RoomVerse AI — Try Before You Buy
> AR-powered interior design platform. Place furniture in your real room before purchasing.

---

## ⚡ Quick Start (2 ways)

### Option A — Python (zero install, built-in)
```bash
cd roomverse
python3 -m http.server 8080
# then open: http://localhost:8080
```

### Option B — Node.js server (included)
```bash
cd roomverse
node server.js
# then open: http://localhost:3000
```

### Option C — Just open the file
```bash
# Double-click index.html OR:
open index.html   # macOS
start index.html  # Windows
```
> ⚠️ AR features require a local server or HTTPS. Use Option A or B for full AR.

---

## 📱 Mobile AR Testing

1. Connect phone and PC to same WiFi
2. Run: `python3 -m http.server 8080`
3. Find your PC's IP: `ipconfig` (Windows) / `ifconfig` (Mac)
4. On phone: open `http://192.168.x.x:8080`
5. Select a product → tap "AR View" → tap "AR" button

**Supported AR devices:**
- iPhone/iPad: iOS 12+ with Safari (uses Quick Look AR)
- Android: Chrome with ARCore (uses Scene Viewer)

---

## 🗂️ Project Structure
```
roomverse/
├── index.html          ← Main app (single page)
├── server.js           ← Optional Node.js dev server
├── css/
│   └── style.css       ← Complete design system
├── js/
│   ├── data.js         ← Product catalog + AI profiles
│   └── app.js          ← Application logic
└── assets/
    ├── models/         ← Add custom .glb files here
    └── images/         ← Product images (optional)
```

---

## ✨ Features

| Feature | Status |
|---|---|
| AR furniture placement | ✅ (mobile) / 3D preview (desktop) |
| Product catalog (15 items) | ✅ |
| Category filtering | ✅ |
| AI style recommendations | ✅ (simulated) |
| Budget estimator with GST | ✅ |
| Cart with qty management | ✅ |
| Screenshot capture | ✅ |
| Rotate & scale controls | ✅ |
| Mobile responsive | ✅ |

---

## 🎨 Adding Custom 3D Models

Replace model URLs in `js/data.js` with your own `.glb` files:

```javascript
// Local file:
model: "assets/models/my-sofa.glb"

// Or any public CDN URL ending in .glb
model: "https://example.com/models/chair.glb"
```

Free `.glb` furniture models:
- [Sketchfab](https://sketchfab.com/features/free-3d-models) (search "furniture glb")
- [Google Poly Archive](https://poly.pizza)
- [Market.pmnd.rs](https://market.pmnd.rs)

---

## 🚀 Demo Script (Hackathon Pitch)

1. **Open landing page** → scroll down to show clean UI
2. **Filter "Sofas"** → click a card → tap "AR View"
3. **3D viewer loads** → rotate/scale controls demo
4. **On phone**: tap "AR" button → walk around room
5. **Back to desktop**: click "✦ Get Recommendations" AI button
6. **Watch highlighted** recommended products appear
7. **Add 3 items** to cart → scroll to Budget → show live total

---

## 🛠 Tech Stack

- **HTML/CSS/JS** — vanilla, no framework
- **Tailwind CSS** via CDN — utility styling
- **Google Model Viewer** — AR/3D rendering
- **WebXR** — device AR (via model-viewer)

---

Built for Hackathon 2025 · RoomVerse AI
