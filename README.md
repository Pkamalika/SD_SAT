# Online Shopping Platform

An online shopping web application developed using HTML, CSS, JavaScript, Node.js, and Express.js. The application allows users to search products, view product details, add items to a shopping cart, place orders, and track deliveries.

## Features

* Search products by name or category
* View product details and prices
* Add products to the shopping cart
* Calculate cart total
* Place orders
* Track order delivery status
* REST API integration
* Responsive user interface

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* REST APIs
* JSON

## Project Structure

```text
online-shopping-platform/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
└── README.md
```

## REST API Endpoints

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| GET    | `/api/products`              | Retrieve all products     |
| GET    | `/api/products?search=phone` | Search products           |
| GET    | `/api/products/1`            | View product details      |
| POST   | `/api/cart`                  | Add a product to the cart |
| GET    | `/api/cart?userId=101`       | View cart                 |
| POST   | `/api/orders`                | Place an order            |
| GET    | `/api/orders/1001/track`     | Track an order            |

## How It Works

1. Users browse or search for products.
2. They view product details and add items to the cart.
3. The application calculates the total price.
4. Users place orders through the backend API.
5. Users can track their orders using the order ID.

## Limitations

* Application data is stored in memory and resets when the server restarts.
* Payment processing is simulated and does not use a real payment gateway.
* Delivery tracking is simulated for demonstration purposes.

## Future Enhancements

* User authentication and registration
* Database integration
* Real payment gateway integration
* Product reviews and ratings
* Admin dashboard
* Email notifications

## Author

Kamalika P

## License

This project is developed for educational purposes.
