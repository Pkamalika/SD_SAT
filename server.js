const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const products = [
  { id: 1, name: "Smartphone", category: "Electronics", price: 15000, stock: 20, emoji: "📱", description: "Fast, stylish smartphone for everyday use." },
  { id: 2, name: "Wireless Headphones", category: "Electronics", price: 2499, stock: 35, emoji: "🎧", description: "Comfortable headphones with rich sound." },
  { id: 3, name: "Running Shoes", category: "Fashion", price: 1999, stock: 18, emoji: "👟", description: "Lightweight shoes for daily training." },
  { id: 4, name: "Smart Watch", category: "Electronics", price: 3299, stock: 12, emoji: "⌚", description: "Track your activity and stay connected." },
  { id: 5, name: "Backpack", category: "Fashion", price: 899, stock: 25, emoji: "🎒", description: "Everyday backpack with spacious storage." },
  { id: 6, name: "Coffee Mug", category: "Home", price: 299, stock: 50, emoji: "☕", description: "A ceramic mug for your favourite drink." }
];

let cart = [];
let orders = [];
let nextOrderId = 1001;

app.get("/api/health", (req, res) => res.json({ status: "OK", message: "Online Shopping API is running" }));

// GET /api/products?search=phone
app.get("/api/products", (req, res) => {
  const term = (req.query.search || "").toLowerCase();
  const result = products.filter(p =>
    p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
  );
  res.json(result);
});

// GET /api/products/1
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST /api/cart  body: { "userId": 101, "productId": 1, "quantity": 2 }
app.post("/api/cart", (req, res) => {
  const { userId = 101, productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === Number(productId));
  if (!product) return res.status(404).json({ error: "Product not found" });
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ error: "Quantity must be a positive integer" });
  if (qty > product.stock) return res.status(400).json({ error: "Not enough stock" });

  const existing = cart.find(item => item.productId === product.id && item.userId === Number(userId));
  if (existing) existing.quantity += qty;
  else cart.push({ userId: Number(userId), productId: product.id, quantity: qty });

  res.status(201).json({ message: "Product added to cart", cart: getCart(Number(userId)) });
});

function getCart(userId = 101) {
  return cart.filter(item => item.userId === userId).map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, name: product.name, price: product.price, subtotal: product.price * item.quantity };
  });
}

// GET /api/cart?userId=101
app.get("/api/cart", (req, res) => {
  const items = getCart(Number(req.query.userId || 101));
  res.json({ items, total: items.reduce((sum, item) => sum + item.subtotal, 0) });
});

// POST /api/orders body: { "userId": 101 }
app.post("/api/orders", (req, res) => {
  const userId = Number(req.body.userId || 101);
  const items = getCart(userId);
  if (!items.length) return res.status(400).json({ error: "Cart is empty" });

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (item.quantity > product.stock) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
  }
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  });

  const order = {
    orderId: nextOrderId++,
    userId,
    items,
    totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
    status: "PLACED",
    deliveryStatus: "PROCESSING",
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  cart = cart.filter(item => item.userId !== userId);
  res.status(201).json({ message: "Order placed successfully", ...order });
});

// GET /api/orders/1001/track
app.get("/api/orders/:id/track", (req, res) => {
  const order = orders.find(o => o.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found. Place an order first." });
  res.json({ orderId: order.orderId, status: order.status, deliveryStatus: order.deliveryStatus });
});

// Demo endpoint to move delivery status forward.
app.patch("/api/orders/:id/track", (req, res) => {
  const order = orders.find(o => o.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  const stages = ["PROCESSING", "PACKED", "IN_TRANSIT", "DELIVERED"];
  const index = stages.indexOf(order.deliveryStatus);
  order.deliveryStatus = stages[Math.min(index + 1, stages.length - 1)];
  res.json({ orderId: order.orderId, deliveryStatus: order.deliveryStatus });
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Online Shopping Platform running at http://localhost:${PORT}`));
