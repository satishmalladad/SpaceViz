// ============================================================
// ROOMVERSE AI — APP LOGIC
// ============================================================

let state = { selectedProduct: null, aiStyle: null, budget: 5000, cart: [] };
let currentScale = 1;

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(PRODUCTS);
  updateBudgetDisplay();
});

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
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc || ""}</div>
        <div class="card-footer">
          <div class="card-price">₹${p.price}</div>
          <div class="card-actions">
            <button class="btn-ar" onclick="openAR(${p.id})">AR</button>
            <button class="btn-cart" onclick="addToCart(${p.id})">+</button>
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

  const viewer = document.getElementById("mainModelViewer");
  const loader = document.getElementById("modelLoader");
  const modelWrap = document.getElementById("arModelWrap");
  const placeholder = document.getElementById("arPlaceholder");

  if (!viewer) { showToast("Viewer not found"); return; }

  // Show panel
  if (modelWrap) modelWrap.style.display = "block";
  if (placeholder) placeholder.style.display = "none";
  if (loader) loader.style.display = "flex";

  // Force reload model
  viewer.removeAttribute("src");
  setTimeout(() => {
    viewer.setAttribute("src", product.model);
  }, 200);

  viewer.addEventListener("load", () => {
    if (loader) loader.style.display = "none";
    const btn = document.getElementById("screenshotBtn");
    if (btn) btn.style.display = "block";
    showToast("✅ Model Ready — tap AR to place!");
  }, { once: true });

  // Update info panel
  const info = document.getElementById("arSelectedInfo");
  if (info) {
    info.innerHTML = `
      <h4>${product.name}</h4>
      <p style="color:#d4a843;font-weight:600;margin:6px 0;">₹${product.price}</p>
      <p style="font-size:12px;color:#aaa;">Tap AR button to place in your room</p>
      <button onclick="addToCart(${product.id})" style="margin-top:12px;width:100%;padding:10px;
        background:var(--gold);color:#000;border:none;border-radius:10px;
        font-weight:600;cursor:pointer;">+ Add to Cart</button>`;
  }

  // Scroll to viewer
  document.getElementById("ar-viewer").scrollIntoView({ behavior: "smooth" });
  showToast(`Loading ${product.name}...`);
}

// ── LAUNCH AR ─────────────────────────────────────────────
function launchAR() {
  const viewer = document.getElementById("mainModelViewer");
  if (!viewer || !viewer.getAttribute("src")) {
    showToast("Select a product first"); return;
  }
  if (viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      try { viewer.activateAR(); } catch (e) { showToast("AR not supported on this browser."); }
    } else {
      showToast("📱 Open on mobile for AR!");
    }
  }
}

// ── ROTATE & SCALE ────────────────────────────────────────
function rotateModel(deg) {
  const viewer = document.getElementById("mainModelViewer");
  const current = viewer.getAttribute("camera-orbit") || "0deg 75deg 2.5m";
  const angle = parseInt(current) || 0;
  viewer.setAttribute("camera-orbit", `${angle + deg}deg 75deg 2.5m`);
}

function scaleModel(factor) {
  const viewer = document.getElementById("mainModelViewer");
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
  } catch(e) { showToast("Use device screenshot on mobile"); }
}

// ── CART ──────────────────────────────────────────────────
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = state.cart.find(i => i.id === id);
  if (existing) { existing.qty++; } 
  else { state.cart.push({ ...product, qty: 1 }); }
  updateCartUI();
  showToast(`🛋️ ${product.name} added!`, "success");
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  updateCartUI();
}

function clearCart() {
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
    document.getElementById("subtotalVal").innerText = "₹0";
    document.getElementById("taxVal") && (document.getElementById("taxVal").innerText = "₹0");
    document.getElementById("totalVal").innerText = "₹0";
    return;
  }

  let subtotal = 0;
  container.innerHTML = state.cart.map(item => {
    subtotal += item.price * item.qty;
    return `<div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>`;
  }).join("");

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  document.getElementById("subtotalVal").innerText = `₹${subtotal.toLocaleString('en-IN')}`;
  if (document.getElementById("taxVal"))
    document.getElementById("taxVal").innerText = `₹${tax.toLocaleString('en-IN')}`;
  document.getElementById("totalVal").innerText = `₹${total.toLocaleString('en-IN')}`;
  if (document.getElementById("floatTotal"))
    document.getElementById("floatTotal").innerText = `₹${total.toLocaleString('en-IN')}`;
  updateBudgetCalc(total);
}

function updateBudgetCalc(total = 0) {
  const pct = Math.min((total / state.budget) * 100, 100);
  const fill = document.getElementById("meterFill");
  if (fill) { fill.style.width = pct + "%"; fill.className = `meter-fill ${total > state.budget ? "over" : ""}`; }
  const status = document.getElementById("budgetStatus");
  if (!status) return;
  if (total === 0) { status.textContent = ""; return; }
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
  document.getElementById("budgetSliderVal").innerText = `₹${state.budget.toLocaleString('en-IN')}`;
  document.getElementById("meterMax").innerText = `₹${state.budget.toLocaleString('en-IN')}`;
}

function toggleBudgetPanel() {
  const panel = document.getElementById("budgetFloatPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function handleCheckout() {
  if (state.cart.length === 0) { showToast("Add items first!", "error"); return; }
  showToast("🎉 Order placed! (Demo)", "success");
}

// ── AI ────────────────────────────────────────────────────
async function analyzeRoom() {
  const file = document.getElementById("roomImage").files[0];
  if (!file) { showToast("Upload an image first"); return; }
  document.getElementById("aiOutput").innerText = "Analyzing your room...";
  document.getElementById("aiLoader").style.display = "block";
  document.getElementById("aiRoomImage").style.display = "none";
  document.getElementById("aiProducts").innerHTML = "";
  const formData = new FormData();
  formData.append("image", file);
  try {
    const res = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await res.json();
    state.aiStyle = data.style || "modern";
    document.getElementById("aiOutput").innerText = `Detected Style: ${state.aiStyle}`;
    document.getElementById("aiLoader").style.display = "none";
    applyAIRecommendations();
    generateRoomDesign(state.aiStyle);
  } catch (err) {
    document.getElementById("aiLoader").style.display = "none";
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
    <div class="ai-product" style="display:flex;align-items:center;justify-content:space-between;
      padding:12px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;">
      <span>${p.emoji} ${p.name}</span>
      <span style="color:var(--gold)">₹${p.price}</span>
      <button onclick="addToCart(${p.id})" style="padding:6px 12px;background:var(--gold);
        color:#000;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Add</button>
    </div>`).join("");
}

async function generateRoomDesign(style) {
  try {
    const res = await fetch("/api/generate-room", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style })
    });
    const data = await res.json();
    const img = document.getElementById("aiRoomImage");
    img.src = data.image; img.style.display = "block";
  } catch(e) { console.log("Room gen failed"); }
}

// ── VOICE ─────────────────────────────────────────────────
function startVoice() {
  if (!('webkitSpeechRecognition' in window)) { showToast("Voice not supported"); return; }
  const recognition = new webkitSpeechRecognition();
  recognition.start();
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.toLowerCase();
    if (text.includes("sofa")) filterCatalog("sofa", null);
    else if (text.includes("table")) filterCatalog("table", null);
    else if (text.includes("lamp")) filterCatalog("lamp", null);
    else if (text.includes("plant")) filterCatalog("plant", null);
    else if (text.includes("cheap")) renderCatalog(PRODUCTS.filter(p => p.price < 2000));
    showToast(`🎤 Heard: "${text}"`);
  };
  recognition.onerror = () => showToast("Voice error");
}

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg, type = "") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = "toast"; }, 2500);
}