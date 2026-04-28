// ============================================================
// ROOMVERSE AI — PRODUCT DATA
// Using real .glb models from Google Model Viewer samples
// ============================================================

const PRODUCTS = [
  // ── SOFAS ──────────────────────────────────────────────
  {
    id: 1,
    name: "Nordic Cloud Sofa",
    category: "sofa",
    price: 4299,
    emoji: "🛋️",
    desc: "Minimalist 3-seater with Scandinavian oak legs and cloud-soft cushions.",
    badge: "new",
    style: "modern",
    color: "white",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb",
    arSupported: true
  },
  {
    id: 2,
    name: "Velvet Luxe Sectional",
    category: "sofa",
    price: 8749,
    emoji: "🛋️",
    desc: "Deep-seated L-shape sectional in premium velvet. Midnight navy.",
    badge: "sale",
    style: "luxury",
    color: "navy",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb",
    arSupported: true
  },
  {
    id: 3,
    name: "Terra Linen Loveseat",
    category: "sofa",
    price: 2899,
    emoji: "🪑",
    desc: "Two-seater in natural linen. Sustainable solid wood base.",
    badge: null,
    style: "organic",
    color: "beige",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb",
    arSupported: true
  },

  // ── TABLES ─────────────────────────────────────────────
  {
    id: 4,
    name: "Walnut Studio Desk",
    category: "table",
    price: 1899,
    emoji: "🪵",
    desc: "Live-edge walnut work desk with hairpin steel legs.",
    badge: "new",
    style: "modern",
    color: "walnut",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/WaterBottle/glTF-Binary/WaterBottle.glb",
    arSupported: true
  },
  {
    id: 5,
    name: "Marble Top Coffee Table",
    category: "table",
    price: 3200,
    emoji: "⬜",
    desc: "Italian Carrara marble tabletop on brushed brass frame.",
    badge: null,
    style: "luxury",
    color: "white",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/WaterBottle/glTF-Binary/WaterBottle.glb",
    arSupported: true
  },
  {
    id: 6,
    name: "Acacia Round Dining",
    category: "table",
    price: 2450,
    emoji: "🪵",
    desc: "Seats 4 comfortably. Organic acacia wood grain finish.",
    badge: null,
    style: "organic",
    color: "wood",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/WaterBottle/glTF-Binary/WaterBottle.glb",
    arSupported: true
  },

  // ── LAMPS ──────────────────────────────────────────────
  {
    id: 7,
    name: "Arc Brass Floor Lamp",
    category: "lamp",
    price: 1120,
    emoji: "💡",
    desc: "Sweeping arch floor lamp. Antique brass with linen shade.",
    badge: "new",
    style: "luxury",
    color: "gold",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb",
    arSupported: true
  },
  {
    id: 8,
    name: "Edison Cage Pendant",
    category: "lamp",
    price: 680,
    emoji: "🔆",
    desc: "Industrial cage pendant with filament bulb. Matte black.",
    badge: null,
    style: "industrial",
    color: "black",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb",
    arSupported: true
  },
  {
    id: 9,
    name: "Noma Concrete Table Lamp",
    category: "lamp",
    price: 445,
    emoji: "🕯️",
    desc: "Sculptural cast concrete base. Warm linen drum shade.",
    badge: null,
    style: "modern",
    color: "grey",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb",
    arSupported: true
  },

  // ── PLANTS ─────────────────────────────────────────────
  {
    id: 10,
    name: "Monstera Deliciosa",
    category: "plant",
    price: 299,
    emoji: "🌿",
    desc: "Statement Swiss cheese plant in terracotta pot. 80cm tall.",
    badge: "new",
    style: "organic",
    color: "green",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.glb",
    arSupported: true
  },
  {
    id: 11,
    name: "Fiddle Leaf Fig",
    category: "plant",
    price: 549,
    emoji: "🌳",
    desc: "Designer favourite. Lush large-leaf indoor tree. 100cm+.",
    badge: null,
    style: "modern",
    color: "green",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.glb",
    arSupported: true
  },
  {
    id: 12,
    name: "White Orchid Cluster",
    category: "plant",
    price: 199,
    emoji: "🌸",
    desc: "Triple-stem white orchid in glazed ceramic pot. Elegant.",
    badge: null,
    style: "luxury",
    color: "white",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.glb",
    arSupported: true
  },

  // ── DECOR ──────────────────────────────────────────────
  {
    id: 13,
    name: "Wabi-Sabi Mirror",
    category: "decor",
    price: 899,
    emoji: "🪞",
    desc: "Irregular shaped arch mirror. Organic asymmetric frame.",
    badge: "new",
    style: "organic",
    color: "beige",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb",
    arSupported: true
  },
  {
    id: 14,
    name: "Boucle Accent Chair",
    category: "decor",
    price: 1650,
    emoji: "🪑",
    desc: "Cloud-like boucle fabric on walnut swivel base. Cream.",
    badge: "sale",
    style: "modern",
    color: "cream",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb",
    arSupported: true
  },
  {
    id: 15,
    name: "Linen Bookshelf",
    category: "decor",
    price: 2100,
    emoji: "📚",
    desc: "Modular open shelving. Oak veneer with linen backing panels.",
    badge: null,
    style: "modern",
    color: "oak",
    model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/WaterBottle/glTF-Binary/WaterBottle.glb",
    arSupported: true
  }
];

// ============================================================
// AI STYLE PROFILES
// ============================================================

const AI_PROFILES = [
  {
    style: "Scandinavian Minimal",
    trigger: ["white", "modern", "minimal"],
    description: "Clean lines detected → Scandinavian palette preferred",
    recommendations: [1, 4, 10, 7],
    palette: ["White", "Oak", "Warm Grey"],
    tip: "Keep surfaces clear. Use texture (linen, boucle) for warmth."
  },
  {
    style: "Warm Organic",
    trigger: ["organic", "natural", "beige", "warm"],
    description: "Earthy tones detected → Natural material harmony",
    recommendations: [3, 6, 10, 13],
    palette: ["Terracotta", "Warm Beige", "Walnut"],
    tip: "Layer natural textiles. Mix terracotta, linen, and live-edge wood."
  },
  {
    style: "Dark Luxury",
    trigger: ["luxury", "dark", "dramatic", "moody"],
    description: "Luxury preference detected → Rich textures + metallics",
    recommendations: [2, 5, 7, 12],
    palette: ["Midnight Navy", "Brass", "Marble White"],
    tip: "Anchor the room with a velvet sofa. Use brass accents sparingly."
  },
  {
    style: "Modern Industrial",
    trigger: ["industrial", "urban", "black", "concrete"],
    description: "Industrial aesthetic detected → Raw materials + clean edges",
    recommendations: [8, 4, 15, 9],
    palette: ["Matte Black", "Concrete", "Raw Steel"],
    tip: "Exposed brick or concrete walls pair perfectly with warm filament lighting."
  }
];

// Rotating AI analysis messages
const AI_MESSAGES = [
  "Analyzing your room dimensions and lighting conditions...",
  "Cross-referencing 500+ furniture pieces for style compatibility...",
  "Matching color temperatures to ambient light profile...",
  "Running spatial harmony algorithm...",
  "Consulting seasonal trend database...",
  "Finalizing your personalized furniture recommendations..."
];