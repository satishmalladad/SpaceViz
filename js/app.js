// ============================================================
// ROOMVERSE AI — FINAL APP LOGIC (FIXED & STABLE)
// ============================================================

// ---------------- STATE ----------------
let state = {
  selectedProduct: null,
  aiStyle: null,
  budget: 5000,
  cart: []
};

// 🔥 SAFE ALIAS (prevents future bugs)
const renderCatalogFromList = renderCatalog;

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
  if (!window.PRODUCTS) {
    console.error("❌ data.js not loaded");
  }

  renderCatalog(PRODUCTS);
  updateBudgetDisplay();
});

// ============================================================
// 🧠 AI IMAGE ANALYSIS
// ============================================================
async function analyzeRoom() {
  const file = document.getElementById("roomImage").files[0];
  if (!file) return showToast("Upload image first");

  // 🔥 Show loading
  document.getElementById("aiOutput").innerText = "Analyzing your room...";
  document.getElementById("aiLoader").style.display = "block";

  // 🔥 Hide previous results (important UX fix)
  document.getElementById("aiRoomImage").style.display = "none";
  document.getElementById("aiProducts").innerHTML = "";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log("AI RESPONSE:", data); // 🔍 debug

    state.aiStyle = data.style || "modern";

    document.getElementById("aiOutput").innerText =
      `Detected Style: ${state.aiStyle}`;

    // 🔥 Hide loader
    document.getElementById("aiLoader").style.display = "none";

    // 🔥 Apply AI results
    applyAIRecommendations();

    // 🔥 Generate room image
    generateRoomDesign(state.aiStyle);

  } catch (err) {
    console.error(err);

    document.getElementById("aiLoader").style.display = "none";

    // 🔥 fallback (VERY IMPORTANT for demo)
    state.aiStyle = "modern";
    applyAIRecommendations();

    showToast("AI failed, using default style");
  }
}

// ============================================================
// 🧠 APPLY AI RECOMMENDATION (FIXED)
// ============================================================
function applyAIRecommendations() {
  if (!state.aiStyle) {
    console.warn("⚠️ No AI style detected");
    return;
  }

  let results = [];

  try {
    results = getAIRecommendations(state.aiStyle, state.budget);
  } catch (e) {
    console.error("AI Recommendation error:", e);
    results = PRODUCTS;
  }

  // 🔥 SAFETY FALLBACK (never empty UI)
  if (!results || results.length === 0) {
    console.warn("⚠️ Empty AI results → using full catalog");
    results = PRODUCTS;
  }

  // ============================================================
  // 🔥 MAIN UI RENDER
  // ============================================================
  renderCatalog(results);

  // ============================================================
  // 🔥 AI SUGGESTED PRODUCTS (TOP 3 ONLY)
  // ============================================================
  showAIProducts(results.slice(0, 3));

  // ============================================================
  // 🔥 HIGHLIGHT IN GRID
  // ============================================================
  highlightRecommended(results);

  // ============================================================
  // 🔥 SMOOTH SCROLL (UX BOOST)
  // ============================================================
  document.getElementById("aiProducts")?.scrollIntoView({
    behavior: "smooth"
  });
}
// glow effect
function highlightRecommended(list) {
  setTimeout(() => {
    list.forEach(p => {
      const el = document.querySelector(`[data-id="${p.id}"]`);
      if (el) {
        el.style.border = "1px solid gold";
        el.style.boxShadow = "0 0 20px rgba(212,168,67,0.3)";
      }
    });
  }, 300);
}

// ============================================================
// 🧱 RENDER PRODUCTS
// ============================================================
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
            <button class="btn-ar" onclick="viewInAR(${p.id})">AR</button>
            <button class="btn-cart" onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ============================================================
// 🎯 FILTER
// ============================================================
function filterCatalog(category, btn) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const filtered = filterByCategory(category);
  renderCatalog(filtered);
}

// ============================================================
// 🪑 AR VIEW
// ============================================================
function viewInAR(id) {
  const product = PRODUCTS.find(p => p.id === id);
  state.selectedProduct = product;

  const viewer = document.getElementById("mainModelViewer");
  if (!viewer) return;

  viewer.src = product.model;

  document.getElementById("arPlaceholder").style.display = "none";
  document.getElementById("arModelWrap").style.display = "block";

  checkFit(product);

  showToast(`Viewing ${product.name}`);
}

// ============================================================
// 📏 FIT CHECK
// ============================================================
function checkFit(product) {
  const room = parseInt(document.getElementById("roomWidth")?.value);

  if (!room) return;

  if (product.width && product.width > room) {
    showToast("❌ Too big for your room", "error");
  } else {
    showToast("✅ Perfect fit", "success");
  }
}

// ============================================================
// 🛒 CART SYSTEM
// ============================================================
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);

  const existing = state.cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast("Added to cart", "success");
}

function updateCartUI() {
  document.getElementById("cartCount").innerText = state.cart.length;

  const container = document.getElementById("cartItems");
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `<p>No items</p>`;
    return;
  }

  container.innerHTML = "";

  let total = 0;

  state.cart.forEach(item => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>₹${item.price}</span>
      </div>
    `;
  });

  document.getElementById("subtotalVal").innerText = `₹${total}`;
  document.getElementById("totalVal").innerText = `₹${total}`;
}

// ============================================================
// 🎤 VOICE CONTROL
// ============================================================
const recognition = new webkitSpeechRecognition();

function startVoice() {
  recognition.start();
}

recognition.onresult = (e) => {
  const text = e.results[0][0].transcript.toLowerCase();

  if (text.includes("sofa")) filterCatalog("sofa");
  if (text.includes("table")) filterCatalog("table");

  if (text.includes("cheap")) {
    renderCatalog(PRODUCTS.filter(p => p.price < 3000));
  }

  showToast(`Heard: ${text}`);
};

// ============================================================
// 💰 BUDGET
// ============================================================
function updateBudgetDisplay() {
  const slider = document.getElementById("budgetSlider");
  if (!slider) return;

  state.budget = parseInt(slider.value);

  document.getElementById("budgetSliderVal").innerText =
    `₹${state.budget}`;

  document.getElementById("meterMax").innerText =
    `₹${state.budget}`;
}

// ============================================================
// 💬 TOAST
// ============================================================
function showToast(msg, type = "") {
  const toast = document.getElementById("toast");

  toast.innerText = msg;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}

async function generateRoomDesign(style) {
  const res = await fetch("/api/generate-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ style })
  });

  const data = await res.json();

  const img = document.getElementById("aiRoomImage");
  img.src = data.image;
  img.style.display = "block";

  // animation
  img.onload = () => {
    img.classList.add("show");
  };
}

function showAIProducts(list) {
  const container = document.getElementById("aiProducts");
  container.innerHTML = "";

  list.slice(0, 3).forEach(p => {
    container.innerHTML += `
      <div class="ai-product">
        ${p.emoji} ${p.name} - ₹${p.price}
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
  });
}