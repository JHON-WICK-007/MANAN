# Lumière Restaurant API Documentation

This API powers the Lumière Restaurant application. It handles Authentication, Menu retrieval, Reservations, and Order management natively through a MongoDB cluster.

## Base URL
`http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

### Register User
- **Method:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response:** Returns JWT token and user info.

### Login User
- **Method:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response:** Returns `token` string and `user` object. Copied token is required for all `Private` endpoints below.

---

## 2. Menu (`/api/menu`)

### Get All Menu Items
- **Method:** `GET /api/menu`
- **Access:** Public
- **Query Params:** You can use Mongoose queries like `?category=Starters` or `?sort=-price`
- **Response:**
  ```json
  {
    "success": true,
    "count": 14,
    "data": [
      {
        "_id": "60d21...",
        "name": "Truffle Fries",
        "description": "Crispy fries with truffle oil",
        "price": 450,
        "category": "Starters"
      }
    ]
  }
  ```

---

## 3. Reservations (`/api/reservations`)

### Get My Reservations
- **Method:** `GET /api/reservations/my`
- **Access:** Private (Requires Authorization Header)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** List of user's bookings.

### Create Reservation
- **Method:** `POST /api/reservations`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "date": "Nov 24, 2024",
    "time": "19:30",
    "guests": 4,
    "specialRequests": "Window seat preferred"
  }
  ```

### Cancel Reservation
- **Method:** `PATCH /api/reservations/:id/cancel`
- **Access:** Private
- **URL Parameter:** `id` = MongoDB ObjectId `_id` of the reservation.

---

## 4. Orders (`/api/orders`)

### Get My Orders
- **Method:** `GET /api/orders/my`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Retrieves all completed orders including individual quantities.

### Create Order (Checkout)
- **Method:** `POST /api/orders`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "items": [
      { "name": "Truffle Fries", "quantity": 2, "price": 450 }
    ],
    "totalAmount": 900,
    "paymentStatus": "Completed"
  }
  ```
