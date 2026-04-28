// ============================================================
// ROOMVERSE AI — SMART DATA ENGINE (FINAL WORKING)
// ============================================================

// ================= PRODUCTS =================
const PRODUCTS = [
  {
    id: 1,
    name: "Nordic Cloud Sofa",
    category: "sofa",
    price: 4299,
    emoji: "🛋️",
    desc: "Minimalist 3-seater with Scandinavian oak legs.",
    badge: "new",
    style: "modern",
    color: "white",
    width: 180,
    model: "https://modelviewer.dev/shared-assets/models/Chair.glb"
  },
  {
    id: 2,
    name: "Velvet Luxe Sectional",
    category: "sofa",
    price: 8749,
    emoji: "🛋️",
    desc: "Luxury velvet sectional.",
    badge: "sale",
    style: "luxury",
    color: "navy",
    width: 220,
    model: "https://modelviewer.dev/shared-assets/models/Chair.glb"
  },
  {
    id: 3,
    name: "Terra Linen Loveseat",
    category: "sofa",
    price: 2899,
    emoji: "🪑",
    desc: "Organic linen loveseat.",
    badge: null,
    style: "organic",
    color: "beige",
    width: 150,
    model: "https://modelviewer.dev/shared-assets/models/Chair.glb"
  },
  {
    id: 4,
    name: "Walnut Studio Desk",
    category: "table",
    price: 1899,
    emoji: "🪵",
    desc: "Modern walnut desk.",
    badge: "new",
    style: "modern",
    color: "brown",
    width: 140,
    model: "https://modelviewer.dev/shared-assets/models/Chair.glb"
  },
  {
    id: 5,
    name: "Marble Coffee Table",
    category: "table",
    price: 3200,
    emoji: "⬜",
    desc: "Luxury marble table.",
    badge: null,
    style: "luxury",
    color: "white",
    width: 120,
    model: "https://modelviewer.dev/shared-assets/models/Chair.glb"
  }
];

// ================= AI PROFILES =================
const AI_PROFILES = [
  {
    style: "modern",
    weight: { modern: 3, minimal: 2 }
  },
  {
    style: "luxury",
    weight: { luxury: 3 }
  },
  {
    style: "organic",
    weight: { organic: 3 }
  }
];

// ============================================================
// 🧠 AI ENGINE
// ============================================================

// 🔥 SCORE PRODUCT
function scoreProduct(product, detectedStyle) {
  let score = 0;

  if (product.style === detectedStyle) score += 5;

  const profile = AI_PROFILES.find(p => p.style === detectedStyle);

  if (profile && profile.weight[product.style]) {
    score += profile.weight[product.style];
  }

  return score;
}

// 🔥 SMART RECOMMENDATION (FIXED)
function getAIRecommendations(style, budget = null) {
  let scored = PRODUCTS.map(p => ({
    ...p,
    score: scoreProduct(p, style)
  }));

  // budget filter
  if (budget) {
    scored = scored.filter(p => p.price <= budget);
  }

  // sort by score
  scored.sort((a, b) => b.score - a.score);

  // 🔥 IMPORTANT FIX: fallback if empty
  if (scored.length === 0) return PRODUCTS;

  return scored;
}

// 🔥 CATEGORY FILTER
function filterByCategory(category) {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// ============================================================
// 🔥 GLOBAL EXPORT (VERY IMPORTANT FIX)
// ============================================================

// Make functions accessible in app.js
window.PRODUCTS = PRODUCTS;
window.getAIRecommendations = getAIRecommendations;
window.filterByCategory = filterByCategory;