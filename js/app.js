// ============================================================
// ROOMVERSE AI — APP LOGIC
// ============================================================

let state = { selectedProduct: null, aiStyle: null, budget: 5000, cart: [] };
let currentScale = 1;

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(PRODUCTS);
  updateBudgetDisplay();
  startAITypewriter();
});

// ── AI TYPEWRITER ─────────────────────────────────────────
function startAITypewriter() {
  const el = document.getElementById("aiOutput");
  if (!el) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % AI_MESSAGES.length;
    el.innerText = AI_MESSAGES[i];
  }, 3000);
}

// ── RENDER CATALOG ────────────────────────────────────────
function renderCatalog(list) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", p.id);
    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="card-img">${p.emoji || "🪑"}</div>
        ${p.badge ? `<span class="card-badge ${p.badge}">${p.badge.toUpperCase()}</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc || ""}</div>
        <div class="card-footer">
          <div class="card-price">₹${p.price.toLocaleString('en-IN')}</div>
          <div class="card-actions">
            <button class="btn-ar" onclick="openAR(${p.id})">◉ AR</button>
            <button class="btn-cart" id="cartBtn-${p.id}" onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

// ── FILTER ────────────────────────────────────────────────
function filterCatalog(category, btn) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderCatalog(category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === category));
}

// ── OPEN AR ───────────────────────────────────────────────
function openAR(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) { showToast("Product not found"); return; }

  state.selectedProduct = product;
  currentScale = 1;

  const viewer   = document.getElementById("mainModelViewer");
  const loader   = document.getElementById("modelLoader");
  const modelWrap = document.getElementById("arModelWrap");
  const placeholder = document.getElementById("arPlaceholder");

  if (!viewer) { showToast("Viewer not ready"); return; }

  // Show the viewer panel
  if (modelWrap)    modelWrap.style.display = "block";
  if (placeholder)  placeholder.style.display = "none";
  if (loader)       loader.style.display = "flex";

  // Update model source directly
  viewer.src = product.model;

  // Hide loader when loaded
  viewer.addEventListener("load", () => {
    if (loader) loader.style.display = "none";
    const btn = document.getElementById("screenshotBtn");
    if (btn) btn.style.display = "block";
    showToast("✅ Model ready — tap AR to place!");
  }, { once: true });

  // Handle load errors
  viewer.addEventListener("error", () => {
    if (loader) loader.style.display = "none";
    showToast("❌ Failed to load 3D model");
  }, { once: true });

  // Update info panel
  const info = document.getElementById("arSelectedInfo");
  if (info) {
    info.innerHTML = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:2.5rem;margin-bottom:8px;">${product.emoji}</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;">${product.name}</div>
        <div style="color:#d4a843;font-weight:600;font-size:1rem;margin:6px 0;">₹${product.price.toLocaleString('en-IN')}</div>
        <div style="font-size:0.8rem;color:#a09e96;margin-bottom:12px;">${product.desc}</div>
        <button onclick="addToCart(${product.id})" style="width:100%;padding:10px;background:#d4a843;
          color:#000;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.9rem;">
          + Add to Cart
        </button>
      </div>`;
  }

  // Scroll to AR section
  document.getElementById("ar-viewer").scrollIntoView({ behavior: "smooth" });
  showToast(`Loading ${product.name}...`);
}

// ── LAUNCH AR (camera) ────────────────────────────────────
function launchAR() {
  const viewer = document.getElementById("mainModelViewer");
  if (!viewer || !viewer.src) {
    showToast("Select a product first!"); return;
  }
  try {
    viewer.activateAR();
  } catch (e) {
    showToast("📱 Open on Android/iOS for live AR!");
  }
}

// ── ROTATE & SCALE ────────────────────────────────────────
function rotateModel(deg) {
  const viewer = document.getElementById("mainModelViewer");
  if (!viewer) return;
  const current = viewer.getAttribute("camera-orbit") || "0deg 75deg 2.5m";
  const angle = parseInt(current) || 0;
  viewer.setAttribute("camera-orbit", `${angle + deg}deg 75deg 2.5m`);
}

function scaleModel(factor) {
  const viewer = document.getElementById("mainModelViewer");
  if (!viewer) return;
  currentScale = Math.min(Math.max(currentScale * factor, 0.3), 3);
  viewer.setAttribute("camera-orbit", `0deg 75deg ${100 / currentScale}%`);
}

// ── SCREENSHOT ────────────────────────────────────────────
function takeScreenshot() {
  const viewer = document.getElementById("mainModelViewer");
  if (!viewer) return;
  try {
    viewer.toBlob({ idealAspect: true }).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `roomverse-${Date.now()}.png`; a.click();
      URL.revokeObjectURL(url);
      showToast("📸 Screenshot saved!");
    });
  } catch(e) { showToast("Use device screenshot button"); }
}

// ── CART ──────────────────────────────────────────────────
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = state.cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { state.cart.push({ ...product, qty: 1 }); }
  const btn = document.getElementById(`cartBtn-${id}`);
  if (btn) { btn.innerText = "✓"; btn.classList.add("added"); }
  updateCartUI();
  showToast(`🛋️ ${product.name} added!`, "success");
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  const btn = document.getElementById(`cartBtn-${id}`);
  if (btn) { btn.innerText = "+"; btn.classList.remove("added"); }
  updateCartUI();
}

function clearCart() {
  state.cart.forEach(i => {
    const btn = document.getElementById(`cartBtn-${i.id}`);
    if (btn) { btn.innerText = "+"; btn.classList.remove("added"); }
  });
  state.cart = [];
  updateCartUI();
}

function updateCartUI() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").innerText = count;
  if (document.getElementById("floatCartCount"))
    document.getElementById("floatCartCount").innerText = count;

  const container = document.getElementById("cartItems");
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><span>🛋️</span><p>No items added yet</p></div>`;
    ["subtotalVal","taxVal","totalVal"].forEach(id => {
      const el = document.getElementById(id); if (el) el.innerText = "₹0";
    });
    updateBudgetCalc(0);
    return;
  }

  let subtotal = 0;
  container.innerHTML = state.cart.map(item => {
    subtotal += item.price * item.qty;
    return `<div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>`;
  }).join("");

  const tax   = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const sub = document.getElementById("subtotalVal"); if (sub) sub.innerText = `₹${subtotal.toLocaleString('en-IN')}`;
  const tx  = document.getElementById("taxVal");      if (tx)  tx.innerText  = `₹${tax.toLocaleString('en-IN')}`;
  const tot = document.getElementById("totalVal");    if (tot) tot.innerText = `₹${total.toLocaleString('en-IN')}`;
  const ft  = document.getElementById("floatTotal");  if (ft)  ft.innerText  = `₹${total.toLocaleString('en-IN')}`;

  updateBudgetCalc(total);
}

function updateBudgetCalc(total = 0) {
  const pct  = Math.min((total / state.budget) * 100, 100);
  const fill = document.getElementById("meterFill");
  if (fill) { fill.style.width = pct + "%"; fill.className = `meter-fill ${total > state.budget ? "over" : ""}`; }
  const status = document.getElementById("budgetStatus");
  if (!status) return;
  if (total === 0) { status.textContent = ""; status.className = "budget-status"; return; }
  if (total <= state.budget) {
    status.textContent = `✓ ₹${(state.budget - total).toLocaleString('en-IN')} remaining`;
    status.className = "budget-status ok";
  } else {
    status.textContent = `⚠ ₹${(total - state.budget).toLocaleString('en-IN')} over budget`;
    status.className = "budget-status over";
  }
}

// ── BUDGET ────────────────────────────────────────────────
function updateBudgetDisplay() {
  const slider = document.getElementById("budgetSlider");
  if (!slider) return;
  state.budget = parseInt(slider.value);
  const sv = document.getElementById("budgetSliderVal"); if (sv) sv.innerText = `₹${state.budget.toLocaleString('en-IN')}`;
  const mm = document.getElementById("meterMax");        if (mm) mm.innerText = `₹${state.budget.toLocaleString('en-IN')}`;
}

function toggleBudgetPanel() {
  const panel = document.getElementById("budgetFloatPanel");
  if (panel) panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function handleCheckout() {
  if (state.cart.length === 0) { showToast("Add items first!", "error"); return; }
  showToast("🎉 Order placed! (Demo mode)", "success");
}

// ── AI ANALYZE ────────────────────────────────────────────
async function analyzeRoom() {
  const file = document.getElementById("roomImage").files[0];
  if (!file) { showToast("Upload an image first"); return; }
  const out = document.getElementById("aiOutput");
  const loader = document.getElementById("aiLoader");
  if (out) out.innerText = "Analyzing your room...";
  if (loader) loader.style.display = "block";
  const img = document.getElementById("aiRoomImage");
  if (img) img.style.display = "none";
  const aiP = document.getElementById("aiProducts");
  if (aiP) aiP.innerHTML = "";

  const formData = new FormData();
  formData.append("image", file);
  try {
    const res  = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await res.json();
    state.aiStyle = data.style || "modern";
    if (out) out.innerText = `✦ Detected Style: ${state.aiStyle}`;
    if (loader) loader.style.display = "none";
    applyAIRecommendations();
    generateRoomDesign(state.aiStyle);
  } catch (err) {
    if (loader) loader.style.display = "none";
    state.aiStyle = "modern";
    applyAIRecommendations();
    showToast("Using default style");
  }
}

function applyAIRecommendations() {
  let results = [];
  try { results = getAIRecommendations(state.aiStyle, state.budget); }
  catch(e) { results = PRODUCTS; }
  if (!results || results.length === 0) results = PRODUCTS;
  renderCatalog(results);
  showAIProducts(results.slice(0, 3));
}

function showAIProducts(list) {
  const container = document.getElementById("aiProducts");
  if (!container) return;
  container.innerHTML = list.map(p => `
    <div style="display:flex;align-items:center;justify-content:space-between;
      padding:12px 16px;background:var(--surface);border:1px solid var(--border2);
      border-radius:12px;gap:12px;">
      <span style="font-size:1.4rem;">${p.emoji}</span>
      <span style="flex:1;font-size:0.9rem;">${p.name}</span>
      <span style="color:#d4a843;font-weight:600;">₹${p.price.toLocaleString('en-IN')}</span>
      <button onclick="addToCart(${p.id})" style="padding:6px 14px;background:#d4a843;
        color:#000;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.82rem;">
        Add
      </button>
    </div>`).join("");
}

async function generateRoomDesign(style) {
  try {
    const res  = await fetch("/api/generate-room", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style })
    });
    const data = await res.json();
    const img  = document.getElementById("aiRoomImage");
    if (img && data.image) { img.src = data.image; img.style.display = "block"; }
  } catch(e) { console.log("Room gen skipped"); }
}

// ── VOICE ─────────────────────────────────────────────────
function startVoice() {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    showToast("Voice not supported in this browser"); return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.start();
  showToast("🎤 Listening...");
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.toLowerCase();
    if (text.includes("sofa"))  filterCatalog("sofa",  document.querySelector('[data-filter="sofa"]'));
    else if (text.includes("table")) filterCatalog("table", document.querySelector('[data-filter="table"]'));
    else if (text.includes("lamp"))  filterCatalog("lamp",  document.querySelector('[data-filter="lamp"]'));
    else if (text.includes("plant")) filterCatalog("plant", document.querySelector('[data-filter="plant"]'));
    else if (text.includes("cheap") || text.includes("budget"))
      renderCatalog(PRODUCTS.filter(p => p.price < 1500));
    else filterCatalog("all", document.querySelector('[data-filter="all"]'));
    showToast(`🎤 "${text}"`);
  };
  recognition.onerror = () => showToast("Could not hear — try again");
}

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg, type = "") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = "toast"; }, 2500);
}