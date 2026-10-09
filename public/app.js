const $ = (id) => document.getElementById(id);
let products = [];
let cart = [];
let lastOrderId = null;
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

let toastTimer;
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2400);
}

function renderProducts(list) {
  $("resultCount").textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;
  $("productGrid").innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-art"><span class="category-tag">${p.category}</span>${p.emoji}</div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <p class="product-desc">${p.description}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-button" data-add="${p.id}">+ Add to cart</button>
        </div>
      </div>
    </article>`).join("") : `<div class="empty-state">No products found. Try another search.</div>`;
}

async function loadProducts(search = "") {
  products = await api(`/api/products?search=${encodeURIComponent(search)}`);
  renderProducts(products);
}

async function loadCart() {
  const data = await api("/api/cart?userId=101");
  cart = data.items;
  $("cartCount").textContent = cart.reduce((n, item) => n + item.quantity, 0);
  $("cartTotal").textContent = money(data.total);
  $("cartItems").innerHTML = cart.length ? cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return `<div class="cart-row">
      <div class="cart-emoji">${product?.emoji || "🛍️"}</div>
      <div class="cart-item-info"><strong>${item.name}</strong><span>Qty ${item.quantity} × ${money(item.price)}</span></div>
      <span class="cart-subtotal">${money(item.subtotal)}</span>
    </div>`;
  }).join("") : `<p class="muted">Your cart is empty. Add a product to get started.</p>`;
}

$("productGrid").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  try {
    await api("/api/cart", {
      method: "POST",
      body: JSON.stringify({ userId: 101, productId: Number(button.dataset.add), quantity: 1 })
    });
    await loadCart();
    toast("Added to your cart!");
  } catch (error) { toast(error.message); }
});

let searchTimer;
$("search").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadProducts($("search").value).catch(e => toast(e.message)), 180);
});

$("cartButton").addEventListener("click", () => $("cartPanel").scrollIntoView({ behavior: "smooth", block: "center" }));

$("checkoutButton").addEventListener("click", async () => {
  try {
    const order = await api("/api/orders", { method: "POST", body: JSON.stringify({ userId: 101 }) });
    lastOrderId = order.orderId;
    $("orderIdInput").value = order.orderId;
    $("trackingResult").innerHTML = `Order <strong>#${order.orderId}</strong> placed successfully!<br>Total: <strong>${money(order.totalAmount)}</strong><br><span class="status-chip">● ${order.deliveryStatus}</span>`;
    await loadCart();
    toast(`Order #${order.orderId} placed successfully`);
    $("trackingResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) { toast(error.message); }
});

$("trackForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const id = $("orderIdInput").value.trim();
    const data = await api(`/api/orders/${encodeURIComponent(id)}/track`);
    $("trackingResult").innerHTML = `Order <strong>#${data.orderId}</strong><br>Order status: <strong>${data.status}</strong><br><span class="status-chip">● ${data.deliveryStatus}</span><br><button id="advanceTracking" class="text-button">Demo: advance delivery status →</button>`;
    $("advanceTracking").addEventListener("click", async () => {
      try {
        const updated = await api(`/api/orders/${data.orderId}/track`, { method: "PATCH", body: "{}" });
        toast(`Delivery updated: ${updated.deliveryStatus}`);
        $("trackForm").requestSubmit();
      } catch (error) { toast(error.message); }
    });
  } catch (error) {
    $("trackingResult").textContent = error.message;
  }
});

$("apiCheck").addEventListener("click", async () => {
  try {
    const data = await api("/api/health");
    toast(`${data.status}: API is running`);
  } catch (error) { toast("API not reachable. Is the server running?"); }
});

(async function init() {
  try {
    await loadProducts();
    await loadCart();
  } catch (error) {
    $("productGrid").innerHTML = `<div class="empty-state">Could not connect to the API. Run <strong>npm start</strong> in the project terminal.</div>`;
  }
})();
