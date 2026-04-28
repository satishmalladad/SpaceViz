// ============================================================
// ROOMVERSE AI — MAIN APPLICATION
// ============================================================

// ─── STATE ──────────────────────────────────────────────────
const state = {
  cart: [],            // { product, qty }
  selectedProduct: null,
  currentFilter: 'all',
  budget: 5000,
  modelRotation: 0,
  modelScale: 1,
  aiRunning: false
};

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog('all');
  updateBudgetDisplay();
  animateHeroEntry();
  startAITypewriter();
  initNavScroll();
});

// ─── NAVBAR SCROLL EFFECT ────────────────────────────────────
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.borderBottomColor = 'rgba(255,255,255,0.1)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255,255,255,0.07)';
    }
  });
}

// ─── HERO ANIMATION ──────────────────────────────────────────
function animateHeroEntry() {
  // Elements already animated via CSS animation-delay
  // Add intersection observer for catalog items
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.07}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card').forEach(el => observer.observe(el));
}

// ─── CATALOG RENDERING ───────────────────────────────────────
function renderCatalog(filter) {
  const grid = document.getElementById('productGrid');
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = '';

  filtered.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.07}s`;

    const inCart = state.cart.find(c => c.product.id === product.id);
    const addedClass = inCart ? 'added' : '';

    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="card-img" role="img" aria-label="${product.name}">${product.emoji}</div>
        ${product.badge ? `<span class="card-badge ${product.badge}">${product.badge.toUpperCase()}</span>` : ''}
        <div class="card-ar-hint">◉ View in AR</div>
      </div>
      <div class="card-body">
        <p class="card-category">${product.category}</p>
        <h3 class="card-name">${product.name}</h3>
        <p class="card-desc">${product.desc}</p>
        <div class="card-footer">
          <span class="card-price">₹${product.price.toLocaleString('en-IN')}</span>
          <div class="card-actions">
            <button class="btn-ar" onclick="viewInAR(${product.id})" title="View in AR">
              ◉ AR View
            </button>
            <button
              class="btn-cart ${addedClass}"
              id="cartBtn-${product.id}"
              onclick="addToCart(${product.id})"
              title="Add to cart"
            >
              ${inCart ? '✓' : '+'}
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Re-init intersection observer for new cards
  setTimeout(animateHeroEntry, 50);
}

// ─── FILTER CATALOG ──────────────────────────────────────────
function filterCatalog(filter, btn) {
  state.currentFilter = filter;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderCatalog(filter);
}

// ─── AR VIEWER ───────────────────────────────────────────────
function viewInAR(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.selectedProduct = product;
  state.modelRotation = 0;
  state.modelScale = 1;

  // Show model viewer
  const placeholder = document.getElementById('arPlaceholder');
  const modelWrap = document.getElementById('arModelWrap');
  const viewer = document.getElementById('mainModelViewer');

  placeholder.style.display = 'none';
  modelWrap.style.display = 'block';

  // Set model source
  viewer.removeAttribute('src');
  setTimeout(() => {
    viewer.setAttribute('src', product.model);
    viewer.alt = product.name;
  }, 100);

  // Show info panel
  updateARInfoPanel(product);

  // Show screenshot btn
  document.getElementById('screenshotBtn').style.display = 'block';

  // Scroll to AR section
  document.getElementById('ar-viewer').scrollIntoView({ behavior: 'smooth', block: 'start' });

  showToast(`📐 ${product.name} loaded in AR viewer`, 'gold');
}

function updateARInfoPanel(product) {
  const infoPanel = document.getElementById('arSelectedInfo');
  infoPanel.innerHTML = `
    <div class="ar-product-info">
      <div class="info-img">${product.emoji}</div>
      <p class="info-name">${product.name}</p>
      <p class="info-price">₹${product.price.toLocaleString('en-IN')}</p>
      <p class="info-desc">${product.desc}</p>
      <div style="margin-top:14px; display:flex; gap:8px;">
        <button
          style="flex:1; padding:10px; background:var(--gold-dim); border:1px solid var(--gold);
                 color:var(--gold); border-radius:10px; cursor:pointer; font-size:0.82rem; font-weight:600;"
          onclick="addToCart(${product.id})"
        >
          + Add to Cart
        </button>
      </div>
    </div>
  `;
}

// Rotate model via camera orbit
function rotateModel(degrees) {
  const viewer = document.getElementById('mainModelViewer');
  if (!viewer) return;
  state.modelRotation += degrees;
  viewer.cameraOrbit = `${state.modelRotation}deg 75deg auto`;
}

// Scale model
function scaleModel(factor) {
  const viewer = document.getElementById('mainModelViewer');
  if (!viewer) return;
  state.modelScale *= factor;
  state.modelScale = Math.min(Math.max(state.modelScale, 0.3), 3);
  // Model-viewer uses camera distance to simulate scale
  const zoom = 100 / state.modelScale;
  viewer.cameraOrbit = `${state.modelRotation}deg 75deg ${zoom}%`;
}

// Launch AR mode (calls model-viewer's built-in AR)
function launchAR() {
  const viewer = document.getElementById('mainModelViewer');
  if (!viewer) {
    showToast('Please select a product first', 'error');
    return;
  }

  // model-viewer's AR activation
  if (viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    // Fallback message for desktop
    showToast('📱 Open on iPhone/Android for live AR placement!', 'gold');
  }
}

// Screenshot of model viewer
function takeScreenshot() {
  const viewer = document.getElementById('mainModelViewer');
  if (!viewer) return;

  try {
    // model-viewer has a toBlob method
    viewer.toBlob({ idealAspect: true }).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roomverse-ar-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📸 Screenshot saved!', 'success');
    }).catch(() => fallbackScreenshot());
  } catch(e) {
    fallbackScreenshot();
  }
}

function fallbackScreenshot() {
  // Canvas-based fallback
  const viewer = document.getElementById('mainModelViewer');
  if (!viewer) return;

  // Use html2canvas-like approach with visible area
  showToast('📸 Use your device screenshot to capture AR view', 'gold');
}

// ─── CART LOGIC ──────────────────────────────────────────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(c => c.product.id === productId);
  if (existing) {
    existing.qty++;
    showToast(`+1 ${product.name}`, 'success');
  } else {
    state.cart.push({ product, qty: 1 });
    showToast(`🛋️ ${product.name} added to cart`, 'success');
  }

  // Update cart button in grid
  const btn = document.getElementById(`cartBtn-${productId}`);
  if (btn) {
    btn.textContent = '✓';
    btn.classList.add('added');
  }

  updateCartUI();
  updateBudgetCalc();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(c => c.product.id !== productId);
  const btn = document.getElementById(`cartBtn-${productId}`);
  if (btn) {
    btn.textContent = '+';
    btn.classList.remove('added');
  }
  updateCartUI();
  updateBudgetCalc();
  showToast('Item removed', '');
}

function changeQty(productId, delta) {
  const item = state.cart.find(c => c.product.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartUI();
  updateBudgetCalc();
}

function clearCart() {
  state.cart = [];
  // Reset all cart buttons in grid
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.textContent = '+';
    btn.classList.remove('added');
  });
  updateCartUI();
  updateBudgetCalc();
  showToast('Cart cleared', '');
}

function updateCartUI() {
  const count = state.cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('floatCartCount').textContent = count;
  renderCartItems();
}

function renderCartItems() {
  const cartList = document.getElementById('cartItems');
  const floatList = document.getElementById('floatCartItems');

  if (state.cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart">
        <span>🛋️</span>
        <p>No items added yet</p>
        <p>Browse the catalog and add items to see your budget</p>
      </div>`;
    floatList.innerHTML = `<p style="color:var(--text3);font-size:0.82rem;text-align:center;padding:12px;">Cart is empty</p>`;
    return;
  }

  const itemsHTML = state.cart.map(({ product, qty }) => `
    <div class="cart-item">
      <div class="cart-item-icon">${product.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">₹${(product.price * qty).toLocaleString('en-IN')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${product.id}, -1)">−</button>
        <span>${qty}</span>
        <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove">✕</button>
    </div>
  `).join('');

  cartList.innerHTML = itemsHTML;

  // Simplified float panel
  floatList.innerHTML = state.cart.map(({ product, qty }) => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.82rem;">
      <span>${product.emoji} ${product.name} ×${qty}</span>
      <span style="color:var(--gold)">₹${(product.price * qty).toLocaleString('en-IN')}</span>
    </div>
  `).join('');
}

// ─── BUDGET CALCULATOR ────────────────────────────────────────
function updateBudgetCalc() {
  const subtotal = state.cart.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const budget = state.budget;
  const pct = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  // Update totals
  document.getElementById('subtotalVal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('taxVal').textContent = `₹${tax.toLocaleString('en-IN')}`;
  document.getElementById('totalVal').textContent = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('floatTotal').textContent = `₹${total.toLocaleString('en-IN')}`;

  // Update meter
  const fill = document.getElementById('meterFill');
  fill.style.width = `${pct}%`;
  fill.className = `meter-fill ${total > budget ? 'over' : ''}`;

  // Status message
  const statusEl = document.getElementById('budgetStatus');
  if (state.cart.length === 0) {
    statusEl.textContent = '';
    statusEl.className = 'budget-status';
  } else if (total <= budget) {
    const remaining = budget - total;
    statusEl.textContent = `✓ ₹${remaining.toLocaleString('en-IN')} remaining in budget`;
    statusEl.className = 'budget-status ok';
  } else {
    const over = total - budget;
    statusEl.textContent = `⚠ ₹${over.toLocaleString('en-IN')} over budget`;
    statusEl.className = 'budget-status over';
  }
}

function updateBudgetDisplay() {
  const slider = document.getElementById('budgetSlider');
  const val = parseInt(slider.value);
  state.budget = val;

  document.getElementById('budgetSliderVal').textContent = `₹${val.toLocaleString('en-IN')}`;
  document.getElementById('meterMax').textContent = `₹${val.toLocaleString('en-IN')}`;

  updateBudgetCalc();
}

// ─── BUDGET PANEL TOGGLE ──────────────────────────────────────
function toggleBudgetPanel() {
  const panel = document.getElementById('budgetFloatPanel');
  const isVisible = panel.style.display !== 'none';
  panel.style.display = isVisible ? 'none' : 'block';

  if (!isVisible) {
    renderCartItems();
  }
}

// ─── CHECKOUT ─────────────────────────────────────────────────
function handleCheckout() {
  if (state.cart.length === 0) {
    showToast('Add items to cart first!', 'error');
    return;
  }
  const total = state.cart.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  showToast(`🎉 Order placed! Total ₹${total.toLocaleString('en-IN')} — Demo only`, 'gold');
}

// ─── AI RECOMMENDATION ENGINE ─────────────────────────────────
let aiTypewriterTimer = null;
let aiMsgIndex = 0;

function startAITypewriter() {
  // Cycle through analysis messages
  const outputEl = document.getElementById('aiOutput');
  if (!outputEl) return;

  setInterval(() => {
    if (!state.aiRunning) {
      aiMsgIndex = (aiMsgIndex + 1) % AI_MESSAGES.length;
      typewriterEffect(outputEl, AI_MESSAGES[aiMsgIndex], 35);
    }
  }, 4000);
}

function runAIRecommendation() {
  if (state.aiRunning) return;
  state.aiRunning = true;

  const outputEl = document.getElementById('aiOutput');
  const profiles = AI_PROFILES;

  // Pick a random profile (simulates detection)
  const profile = profiles[Math.floor(Math.random() * profiles.length)];

  // Multi-step animation
  const steps = [
    { msg: `Scanning room environment...`, delay: 600 },
    { msg: `Detected style preference: ${profile.style}`, delay: 1200 },
    { msg: `${profile.description}`, delay: 2000 },
    { msg: `Recommended palette: ${profile.palette.join(' · ')}`, delay: 2800 },
    { msg: `✦ ${profile.tip}`, delay: 3600 }
  ];

  steps.forEach(({ msg, delay }) => {
    setTimeout(() => {
      typewriterEffect(outputEl, msg, 25);
    }, delay);
  });

  // After recommendations, highlight products in catalog
  setTimeout(() => {
    highlightRecommendations(profile.recommendations);
    showToast(`✦ AI Style: ${profile.style} — ${profile.recommendations.length} items recommended`, 'gold');
    state.aiRunning = false;
  }, 4200);
}

function typewriterEffect(element, text, speed = 30) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

function highlightRecommendations(productIds) {
  // Switch to all tab and scroll to catalog
  filterCatalog('all', document.querySelector('.tab[data-filter="all"]'));
  document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });

  // Add highlight effect to recommended cards after render
  setTimeout(() => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      const product = PRODUCTS[i];
      if (product && productIds.includes(product.id)) {
        card.style.borderColor = 'var(--gold)';
        card.style.boxShadow = '0 0 24px var(--gold-glow)';
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
          card.style.transition = 'all 1s ease';
        }, 5000);
      }
    });
  }, 500);
}

// ─── TOAST NOTIFICATIONS ──────────────────────────────────────
let toastTimer = null;

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ─── NAVBAR SMOOTH HIGHLIGHTING ──────────────────────────────
const sections = ['hero','catalog','ar-viewer','ai-recommend','budget'];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
});

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('budgetFloatPanel').style.display = 'none';
  }
  // Press 'r' to run AI
  if (e.key === 'r' && document.activeElement.tagName !== 'INPUT') {
    runAIRecommendation();
  }
});

// ─── MODEL VIEWER EVENTS ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('mainModelViewer');
  if (!viewer) return;

  viewer.addEventListener('ar-status', (e) => {
    if (e.detail.status === 'session-started') {
      showToast('🎯 AR session started — move to place furniture', 'success');
    } else if (e.detail.status === 'not-presenting') {
      showToast('AR session ended', '');
    } else if (e.detail.status === 'failed') {
      showToast('📱 AR requires mobile device with WebXR support', 'error');
    }
  });

  viewer.addEventListener('load', () => {
    if (state.selectedProduct) {
      showToast('✓ 3D model loaded successfully', 'success');
    }
  });
});

// ─── UTILITY: FORMAT INR ──────────────────────────────────────
function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ─── WINDOW RESIZE ────────────────────────────────────────────
window.addEventListener('resize', () => {
  // Close float panel on desktop resize
  if (window.innerWidth > 768) {
    document.getElementById('budgetFloatPanel').style.display = 'none';
  }
});
