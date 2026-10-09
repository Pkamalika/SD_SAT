# ShopEase — Online Shopping Platform

A quick full-stack demo for a Low-Level Design / REST API practical.

## Requirements
- Node.js (18+ recommended)
- VS Code

## Run in VS Code
1. Extract the ZIP file.
2. Open the `online-shopping-platform` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run `npm install`
5. Run `npm start`
6. Open `http://localhost:3000` in your browser.

Keep the terminal running while using the website.

## REST APIs
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/products?search=phone` | Search products |
| GET | `/api/products/1` | View product details |
| POST | `/api/cart` | Add to cart |
| GET | `/api/cart?userId=101` | View cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/1001/track` | Track delivery |
| PATCH | `/api/orders/1001/track` | Advance demo delivery status |

### Postman examples

**Add to cart**
- Method: `POST`
- URL: `http://localhost:3000/api/cart`
- Body → raw → JSON:
```json
{ "userId": 101, "productId": 1, "quantity": 2 }
```

**Place order**
- Method: `POST`
- URL: `http://localhost:3000/api/orders`
- Body → raw → JSON:
```json
{ "userId": 101 }
```

**Track order**
- Method: `GET`
- URL: `http://localhost:3000/api/orders/1001/track`

The order ID is returned by the place-order response; use that actual ID when tracking.

## Notes
- Product/cart/order data is stored in memory for demo purposes and resets when the server restarts.
- Checkout is simulated; no real payment provider is connected.
- Delivery status can be advanced using the demo PATCH endpoint.
