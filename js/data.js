const PRODUCTS = [
  { id: 1, name: "Nordic Cloud Sofa", category: "sofa", price: 4299, emoji: "🛋️", desc: "Minimalist 3-seater with Scandinavian oak legs.", badge: "new", style: "modern", color: "white", width: 180, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 2, name: "Velvet Luxe Sectional", category: "sofa", price: 8749, emoji: "🛋️", desc: "Luxury velvet sectional.", badge: "sale", style: "luxury", color: "navy", width: 220, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 3, name: "Terra Linen Loveseat", category: "sofa", price: 2899, emoji: "🪑", desc: "Organic linen loveseat.", badge: null, style: "organic", color: "beige", width: 150, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 4, name: "Walnut Studio Desk", category: "table", price: 1899, emoji: "🪵", desc: "Modern walnut desk.", badge: "new", style: "modern", color: "brown", width: 140, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 5, name: "Marble Coffee Table", category: "table", price: 3200, emoji: "⬜", desc: "Luxury marble table.", badge: null, style: "luxury", color: "white", width: 120, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 6, name: "Arc Brass Floor Lamp", category: "lamp", price: 1120, emoji: "💡", desc: "Sweeping arch floor lamp.", badge: "new", style: "luxury", color: "gold", width: 40, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 7, name: "Monstera Deliciosa", category: "plant", price: 299, emoji: "🌿", desc: "Statement plant in terracotta pot.", badge: "new", style: "organic", color: "green", width: 60, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { id: 8, name: "Boucle Accent Chair", category: "decor", price: 1650, emoji: "🪑", desc: "Cloud-like boucle fabric chair.", badge: "sale", style: "modern", color: "cream", width: 80, model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" }
];
const AI_PROFILES = [
  { style: "modern", weight: { modern: 3, minimal: 2 } },
  { style: "luxury", weight: { luxury: 3 } },
  { style: "organic", weight: { organic: 3 } }
];
function scoreProduct(p, s) { let sc=0; if(p.style===s) sc+=5; const pr=AI_PROFILES.find(x=>x.style===s); if(pr&&pr.weight[p.style]) sc+=pr.weight[p.style]; return sc; }
function getAIRecommendations(style, budget=null) { let s=PRODUCTS.map(p=>({...p,score:scoreProduct(p,style)})); if(budget) s=s.filter(p=>p.price<=budget); s.sort((a,b)=>b.score-a.score); return s.length===0?PRODUCTS:s; }
function filterByCategory(c) { return c==="all"?PRODUCTS:PRODUCTS.filter(p=>p.category===c); }
window.PRODUCTS=PRODUCTS; window.getAIRecommendations=getAIRecommendations; window.filterByCategory=filterByCategory;