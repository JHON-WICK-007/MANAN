# Lumière Dining - Real, In-Depth Project Documentation

## 1. Executive Summary & Core Philosophy
Lumière Dining is a comprehensive MERN stack (MongoDB, Express, React, Node) application that powers both a premium restaurant's customer-facing e-commerce platform and its extensive back-office management system. 

The primary design principle is **"Minimalist Luxury."** This manifests across the UI via pure blacks, charcoal grays, translucent glassmorphism techniques, and a warm signature orange (`#ee7c2b`). This aesthetic is meticulously applied to both the customer and admin portals.

---

## 2. Directory Structure & File Map (Deep Dive)

### Backend (`d:\restaurant\backend`)
- **`server.js`**: The primary Node.js/Express entry point. Configures CORS, mounts routers, and binds to PORT.
- **`config/db.js`**: Connects to the MongoDB instance using Mongoose.
- **`middleware/`**
  - `auth.js`: Contains `protect` (verifies JWT) and `authorize("admin")` (checks user role).
  - `errorMiddleware.js`: Catches and formats 500s and Mongoose validation errors into clean JSON.
- **`routes/`**
  - `adminRoutes.js`: (Massive 15KB file). Handles absolute full CRUD for Dashboard stats, Reservations, Tables, Messages, Menus, Users, and Orders.
  - `authRoutes.js`, `menuRoutes.js`, `orderRoutes.js`, `profileRoutes.js`, `reservationRoutes.js`, `healthRoutes.js`: Specialized endpoint controllers.
- **`models/` (The Core Schemas - detailed in Section 3)**
  - `ContactMessage.js`, `Menu.js`, `Order.js`, `Profile.js`, `Reservation.js`, `RestaurantTable.js`, `User.js`.

### Frontend (`d:\restaurant\frontend\src`)
- **`components/`**
  - `Navbar/`, `Footer/`: Global layout elements.
  - `ScrollReveal.jsx`: Advanced intersection observer logic for scroll animations.
  - `UI/`: Core UI library.
- **`context/`**
  - `AuthContext.jsx`: Global JWT and User management.
  - `CartContext.jsx`: Global Cart logic and constraints.
- **`pages/` (The Application Views)**
  - `AboutContact/AboutContact.jsx`: A massive (45KB) file merging about us story with contact forms.
  - `Home/`, `Menu/`, `Cart/`, `Checkout/`, `Table/`, `Profile/`, `OrderStatus/`, `Auth/`: The customer journey.
  - **`Admin/` (The massive back-office suite)**
    - `AdminLayout`: The shell/sidebar for the dashboard.
    - `Dashboard`, `Analytics`, `Customers`, `Menu`, `Messages`, `Orders`, `Reservations`, `Settings`, `Tables`: Individual, highly specialized management screens for administrators.

---

## 3. Database Models (The "Real" Schemas)

This section maps out the exact Mongoose models governing the MongoDB database.

### 3.1 The `User` Model
- **`name`**: String, Required.
- **`email`**: String, Required, Unique.
- **`password`**: String, Required, Hashed via pre-save hook.
- **`phone`**: String.
- **`role`**: Enum `["customer", "admin"]`, Default: `"customer"`.
- *Method:* `matchPassword(enteredPassword)` compares Bcrypt hashes.

### 3.2 The `Menu` Model
- **`name`**: String, Required.
- **`description`**: String, Required.
- **`price`**: Number, Required, Min: 0.
- **`category`**: Enum `["Starters", "Main Course", "Desserts", "Beverages"]`.
- **`image`**: String.
- **`isVeg`**: Boolean, Default: false.
- **`isAvailable`**: Boolean, Default: true.
- *Indexes:* On `category` (for fast filtering) and text index on `name` (for searching).

### 3.3 The `Order` Model
- **`user`**: ObjectId referencing `User`.
- **`orderId`**: String, Unique. Auto-generated via pre-save hook (Format: `ORD-YYMM-XXXX`).
- **`items`**: Array of `{ name, quantity, price }`.
- **`totalAmount`**: Number, Required.
- **`status`**: Enum `["Pending", "Processing", "Delivered", "Cancelled"]`, Default: `"Pending"`.
- **`paymentStatus`**: Enum `["Pending", "Completed", "Failed"]`, Default: `"Pending"`.

### 3.4 The `Reservation` Model
- **`user`**: ObjectId referencing `User`.
- **`userName`, `userEmail`**: String.
- **`table`**: String.
- **`date`, `time`**: String, Required.
- **`guests`**: Number, Min: 1, Max: 20.
- **`specialRequests`**: String, Max length: 500 chars.
- **`status`**: Enum `["Pending", "Confirmed", "Cancelled"]`, Default: `"Pending"`.
- **`bookingId`**: String, Unique. Auto-generated via pre-save hook (Format: `LUM-TIMESTAMP-XXXX`).

### 3.5 The `RestaurantTable` Model
- **`tableId`**: String, Unique, Required.
- **`capacity`**: Number, Min: 1.
- **`type`**: Enum `["Window", "Private", "Terrace", "Kitchen", "Center", "Outdoor"]`.
- **`status`**: Enum `["Available", "Occupied", "Reserved", "Disabled"]`, Default: `"Available"`.

### 3.6 The `ContactMessage` Model
- **`name`, `email`, `phone`**: Strings, Required.
- **`subject`, `message`**: Strings, Required.
- **`status`**: Enum `["Unread", "Read", "Replied"]`, Default: `"Unread"`.

---

## 4. The Admin Suite Engine (`adminRoutes.js`)
Lumière contains an incredibly robust backend tailored for restaurant staff, completely separate from the customer experience. Every route here uses `protect` and `authorize("admin")`.

1. **Dashboard Analytics (`/api/admin/dashboard`)**: Hits 6 collections simultaneously using `Promise.all()` to pull: Today's Reservations, Active Orders, Occupied Tables, Total Customers, and Recent snapshots of orders/bookings.
2. **Reservations CRUD**: Fetch with filters (status, date, search by name). Update (Confirm/Cancel), and Delete.
3. **Tables CRUD**: Admins can map out physical floor plans by creating, updating, and deleting Table objects, tracking their `status` (Available vs Occupied).
4. **Orders Pipeline**: Push orders from `Pending` -> `Processing` -> `Delivered`.
5. **Menu Control**: Live updates to the digital menu, changing `isAvailable` flags if the kitchen runs out of stock.
6. **Customer Relations (CRM)**: Manage `ContactMessage` inquiries and oversee the `User` database.

---

## 5. Frontend Deep Dive: Cart Logic & UI Engineering

### 5.1 The Cart Engine (`Cart.jsx` & `CartContext.jsx`)
The Cart handles extremely specific edge cases:
- **Quantity Hard Limits:** A user cannot add more than `100` of a single item to the cart.
- **Promo Code Dictionary:** Handles exact validation for 10 unique codes (e.g., `LUMIERE20`, `FLAT500`). It parses percentage discounts vs. flat currency discounts natively and updates the final subtotal in real-time.

### 5.2 The Aesthetic Engine (Tailwind & CSS)
Lumière achieves "Minimalist Luxury" via a heavily customized `tailwind.config.js` and `index.css`:
- **Glassmorphism (`.glass`)**: Achieved by combining `rgba` blacks (`#120a05` base) with `backdrop-filter: blur(20px)` and semi-transparent white borders.
- **Floating Labels**: The input fields (specifically in `AboutContact` and `Auth`) feature animated floating labels that transition out of the way when the user types or focuses on the field.
- **Scroll Reveal System**: A custom `IntersectionObserver` wrapper (`ScrollReveal.jsx`) automatically attaches to DOM nodes, ensuring elements fade in and slide up gracefully as the user scrolls down the page.

### 5.3 The User Profile "Danger Zone"
Located at `Profile.jsx`, this highly secure area interacts with `authRoutes.js`.
- **Password Reset:** Requires the legacy password to be verified against the Bcrypt hash before accepting a new string.
- **Account Deletion:** Enforces strict client-side validation (the user must type a confirmation string) before executing a cascaded delete on the backend, which wipes both the `User` model and the `Profile` model to ensure complete GDPR compliance.

---

## 6. Real Project Constraints & Testing Methods

- **Testing Orders:** Currently, `OrderStatus.jsx` relies on a local dictionary mapping (`ord123`, `ord456`) to dummy states (Pending, Preparing, Ready, Delivered) to allow UI testing of the progress bar without needing to manually trigger admin updates.
- **Testing Checkout:** The Checkout UI uses localized SVG components for Visa/Mastercard instead of relying on slow external image APIs, ensuring instant load times and visual consistency on the payment form.

---

## 7. Next Phase Scalability
Based on the exact schemas currently written, the architecture is primed for:
1. **Socket.io Integration:** Changing the `Order` status in `adminRoutes.js` should emit an event. The `OrderStatus.jsx` page can listen to this event, replacing the current dummy mapping with a live, bidirectional WebSockets connection.
2. **Stripe Integration:** The `paymentStatus` enum in `Order.js` is already set up to handle webhook confirmations from Stripe, transitioning from `Pending` to `Completed`.
3. **Table Allocation Engine:** The `Reservation.js` schema contains a `table` string field. This can be directly linked to the `RestaurantTable.js` schema, automatically changing a table's status from `Available` to `Reserved` for specific time blocks.

---
*Generated by Antigravity AI - Accurate, Researched Architecture Master File.*
