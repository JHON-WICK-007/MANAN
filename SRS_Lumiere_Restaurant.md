# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Lumière Fine Dining Restaurant — Web Application

---

| Field | Details |
|-------|---------|
| **Document Title** | Software Requirements Specification — Lumière Restaurant |
| **Version** | 1.0 |
| **Date** | April 2026 |
| **Author** | Manan Vasani |
| **Project** | Lumière Fine Dining Restaurant Web Application |
| **Status** | Final |

---

## TABLE OF CONTENTS

1. Introduction
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Definitions, Acronyms & Abbreviations
   - 1.4 References
   - 1.5 Overview
2. Overall Description
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 Assumptions and Dependencies
3. System Architecture
   - 3.1 Architecture Diagram
   - 3.2 Technology Stack
   - 3.3 Data Flow
4. Specific Requirements
   - 4.1 Functional Requirements
   - 4.2 Non-Functional Requirements
5. Database Design
   - 5.1 Collections / Schemas
6. API Specification
7. User Interface Requirements
8. Use Cases
9. Constraints & Limitations

---

## 1. INTRODUCTION

### 1.1 Purpose

This Software Requirements Specification (SRS) document describes the complete requirements for the **Lumière Fine Dining Restaurant Web Application**. It is intended for developers, evaluators, and project supervisors. The document covers all functional and non-functional requirements, system architecture, database design, API specifications, and use cases.

### 1.2 Scope

**Lumière** is a full-stack web application for a premium fine dining restaurant. It allows:

- Customers to register, log in, browse the menu, book tables, place food orders, track order status, and manage their profile.
- The restaurant to manage menu items via a seeded database.
- A contact form for customer inquiries.

The system is a **Single Page Application (SPA)** on the frontend and a **RESTful API** on the backend, connected to a **cloud-hosted NoSQL database**.

**In Scope:**
- User Authentication (Register / Login / Logout)
- Menu Browsing & Filtering
- Table Reservation System
- Shopping Cart & Checkout
- Order Placement & Tracking
- User Profile Management
- About & Contact Page
- Protected Routes (only logged-in users can access certain pages)

**Out of Scope (Future Enhancements):**
- Payment Gateway Integration (Stripe, Razorpay)
- Admin Dashboard
- Real-time notifications (WebSockets)
- Mobile App

### 1.3 Definitions, Acronyms & Abbreviations

| Term | Definition |
|------|-----------|
| **SRS** | Software Requirements Specification |
| **SPA** | Single Page Application |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |
| **JWT** | JSON Web Token |
| **ODM** | Object Document Mapper |
| **CRUD** | Create, Read, Update, Delete |
| **UI** | User Interface |
| **UX** | User Experience |
| **CORS** | Cross-Origin Resource Sharing |
| **HMR** | Hot Module Replacement |
| **ENV** | Environment Variable |

### 1.4 References

- IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications
- React 18 Documentation — https://react.dev
- Express.js Documentation — https://expressjs.com
- MongoDB Documentation — https://www.mongodb.com/docs
- JSON Web Token Standard — https://jwt.io

### 1.5 Overview

The remainder of this document is organized as follows:
- **Section 2** provides the overall description and context of the product.
- **Section 3** details the system architecture.
- **Section 4** lists all functional and non-functional requirements.
- **Section 5** covers database design.
- **Section 6** documents the full API.
- **Section 7** describes UI requirements.
- **Section 8** presents use case scenarios.
- **Section 9** outlines constraints.

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective

Lumière is a standalone web application built as a full-stack project. It operates independently with its own frontend, backend, and database. It is designed as a premium fine dining platform with a focus on visual excellence and seamless user experience.

```
[Browser / Client]  ←→  [React SPA - Vite]  ←→  [Express REST API]  ←→  [MongoDB Atlas]
```

### 2.2 Product Functions

The major functions of the system are:

1. **User Authentication** — Register and log in securely using JWT
2. **Menu Browsing** — View all dishes by category with pricing
3. **Shopping Cart** — Add, remove, update quantity of dishes
4. **Table Reservation** — Book a table by date, time, guests
5. **Checkout & Ordering** — Convert cart to a placed order
6. **Order Tracking** — Track order status by order ID
7. **Profile Management** — View and update user information + reservation history
8. **About & Contact** — Restaurant story, team, contact form, location map

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|------------|-------------|-------------|
| **Guest** | Unauthenticated visitor | Home, Menu, About/Contact, Login/Register |
| **Registered User** | Logged-in customer | All pages + Table, Cart, Checkout, Profile, Order Status |
| **Admin** *(future)* | Restaurant manager | Admin dashboard (planned) |

### 2.4 Operating Environment

| Component | Environment |
|-----------|------------|
| **Frontend** | Any modern web browser (Chrome, Firefox, Edge, Safari) |
| **Backend** | Node.js v18+ runtime |
| **Database** | MongoDB Atlas (cloud) |
| **Dev Server** | Vite (port 5173), Nodemon (port 5000) |
| **OS** | Windows / macOS / Linux |
| **Network** | Internet connection required (for MongoDB Atlas and Unsplash images) |

### 2.5 Design and Implementation Constraints

- Backend must implement JWT-based stateless authentication.
- Passwords must be hashed using bcryptjs (salt rounds ≥ 10).
- All protected API routes must validate JWT before processing the request.
- Frontend must redirect unauthenticated users to `/login` when accessing protected routes.
- MongoDB Atlas free tier limits apply (512MB storage, shared cluster).
- No payment gateway in current version — checkout simulates order placement.

### 2.6 Assumptions and Dependencies

- Users have access to a modern web browser with JavaScript enabled.
- MongoDB Atlas cluster is accessible at all times.
- The `.env` file contains valid values for `MONGO_URI`, `JWT_SECRET`, `PORT`.
- Unsplash image URLs for menu and team photos remain accessible.
- Node.js and npm are installed on the deployment machine.

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Overview

The project follows a **3-Tier Architecture**:

```
┌──────────────────────────────────────────────────┐
│              PRESENTATION TIER                   │
│         React 18 SPA (built with Vite)           │
│   Port: 5173 (dev) | Routing: React Router v6    │
│   State: Context API (AuthContext, CartContext)   │
└─────────────────────┬────────────────────────────┘
                      │  HTTP/JSON (fetch API)
                      │  Authorization: Bearer <JWT>
┌─────────────────────▼────────────────────────────┐
│               APPLICATION TIER                   │
│          Node.js + Express.js REST API           │
│   Port: 5000 | Middleware: CORS, morgan, JWT     │
│   Pattern: MVC (Routes → Controllers → Models)   │
└─────────────────────┬────────────────────────────┘
                      │  Mongoose ODM
┌─────────────────────▼────────────────────────────┐
│                  DATA TIER                        │
│              MongoDB Atlas (Cloud)               │
│        Collections: Users, Menu, Orders,         │
│             Reservations, Profiles               │
└──────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI Component Framework |
| Vite | 5.x | Build Tool & Dev Server |
| React Router DOM | v6 | Client-side Routing |
| Framer Motion | 11.x | Animations & Transitions |
| TailwindCSS | 3.x | Utility-first CSS Framework |
| Context API | Built-in | Global State Management |
| Fetch API | Browser Built-in | HTTP Requests |

#### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript Runtime |
| Express.js | 4.x | Web Framework / REST Server |
| Mongoose | 8.x | MongoDB ODM |
| bcryptjs | 2.x | Password Hashing |
| jsonwebtoken | 9.x | JWT Token Generation & Verification |
| dotenv | 16.x | Environment Variable Management |
| cors | 2.x | Cross-Origin Resource Sharing |
| morgan | 1.x | HTTP Request Logger |
| nodemon | 3.x | Dev Server Auto-restart |

#### Database
| Technology | Details |
|-----------|---------|
| MongoDB | NoSQL Document Database |
| MongoDB Atlas | Cloud Hosting (Free Tier) |

### 3.3 Data Flow

```
USER ACTION (e.g. Place Order)
         │
         ▼
[React Component] 
  - Reads token from AuthContext (localStorage)
  - Calls: fetch('http://localhost:5000/api/orders', { 
      method: 'POST',
      headers: { Authorization: 'Bearer <JWT>' },
      body: JSON.stringify({ items, totalAmount })
    })
         │
         ▼
[Express Server — port 5000]
  → cors() middleware validates origin
  → express.json() parses request body
  → Router: POST /api/orders → orderRoutes.js
  → protect middleware:
       - Reads Authorization header
       - jwt.verify(token, JWT_SECRET)
       - Attaches req.user = await User.findById(decoded.id)
       - calls next()
  → orderController.createOrder():
       - Validates items & totalAmount
       - Creates Order document
       - Auto-generates orderId (e.g. ORD-2604-X7KA)
       - Saves to MongoDB
       - Returns { success: true, order: {...} }
         │
         ▼
[MongoDB Atlas]
  → db.orders.insertOne({ user, orderId, items, totalAmount, status: "Pending" })
  → Returns saved document
         │
         ▼
[React — Updates UI]
  → Clears cart (CartContext)
  → Shows order confirmation with orderId
  → User can track on /order-status page
```

---

## 4. SPECIFIC REQUIREMENTS

### 4.1 Functional Requirements

#### FR-01: User Registration
- **Description:** New users must be able to create an account.
- **Input:** Name, Email, Password, Phone (optional)
- **Processing:** Check if email is unique → Hash password (bcrypt, salt=12) → Save user → Generate JWT
- **Output:** JWT token + User object (name, email, role)
- **Validation:** Email format valid, password min 6 characters, name max 50 characters

#### FR-02: User Login
- **Description:** Registered users must be able to log in.
- **Input:** Email, Password
- **Processing:** Find user by email → Compare password with bcrypt → Generate JWT
- **Output:** JWT token + User object
- **Error Cases:** Invalid credentials return 401 Unauthorized

#### FR-03: Protected Route Access
- **Description:** Certain pages are accessible only to authenticated users.
- **Protected Pages:** `/table`, `/cart`, `/checkout`, `/profile`, `/order-status`
- **Mechanism:** `ProtectedRoute` component in React checks `AuthContext`. If no token, redirect to `/login`.

#### FR-04: Menu Browsing
- **Description:** All visitors (logged in or not) can view the restaurant menu.
- **Input:** None (GET request)
- **Output:** List of menu items with name, description, price, category, image
- **Filter:** Items filtered visually by category (Starters, Mains, Desserts, Beverages)

#### FR-05: Shopping Cart
- **Description:** Authenticated users can add menu items to cart.
- **Operations:** Add item, Remove item, Update quantity (1–100), Clear cart
- **Persistence:** Cart saved in `localStorage` (survives page refresh)
- **Constraint:** Max quantity per item = 100, min = 1

#### FR-06: Table Reservation
- **Description:** Authenticated users can book a table.
- **Input:** Date, Time, Number of Guests (1–20), Special Requests (optional)
- **Processing:** Validate input → Create Reservation → Auto-generate bookingId (e.g. LUM-XXXX-XXXX)
- **Output:** Confirmation with booking ID and status "Pending"

#### FR-07: View & Cancel Reservation
- **Description:** Users can view their reservations and cancel pending ones.
- **Output:** List of reservations sorted by date (newest first)
- **Cancel:** PATCH `/api/reservations/:id/cancel` sets status to "Cancelled"

#### FR-08: Checkout & Order Placement
- **Description:** Users can convert their cart into a placed order.
- **Input:** Cart items (name, quantity, price), Total Amount
- **Processing:** Create order → Auto-generate orderId → Set status "Pending"
- **Output:** Order confirmation with orderId

#### FR-09: Order Status Tracking
- **Description:** Users can track their order using an order ID.
- **Input:** Order ID (e.g. ORD-2604-X7KA)
- **Output:** Order details with current status (Pending / Processing / Delivered / Cancelled)

#### FR-10: User Profile
- **Description:** Users can view and update their profile information.
- **View:** Name, Email, Phone, Role, Avatar, Bio, Joined date
- **Update:** Name, Phone, Bio, Avatar URL
- **Also Shows:** Reservation history in the profile page

#### FR-11: Contact Form
- **Description:** Any visitor can submit a contact/inquiry message.
- **Input:** Name, Email, Phone (optional), Message
- **Processing:** Simulated send (front-end only, no backend endpoint currently)
- **Output:** Success confirmation message

#### FR-12: Logout
- **Description:** Users can log out.
- **Mechanism:** `logout()` in AuthContext clears `localStorage` token and user state → redirects to Home.

---

### 4.2 Non-Functional Requirements

#### NFR-01: Security
- Passwords must never be stored in plain text (bcrypt hash mandatory)
- JWT tokens must be signed with a secret key stored in `.env`
- Protected routes must be validated server-side (not just client-side)
- `select: false` on password field prevents accidental exposure

#### NFR-02: Performance
- Frontend dev server with Vite HMR for instant updates
- API responses should return within 500ms under normal load
- Lazy loading for images (loading="lazy" on `<img>` tags)
- MongoDB indexes on `email` (unique) for fast user lookup

#### NFR-03: Usability
- UI must be responsive and work on mobile, tablet, and desktop
- Form fields must show validation errors clearly
- Loading states shown for all async operations
- Toast/status messages for success and error feedback

#### NFR-04: Reliability
- Error handler middleware catches all unhandled errors and returns structured JSON
- Frontend gracefully handles API errors (shows user-friendly messages)
- 404 handler returns proper JSON for unknown routes

#### NFR-05: Maintainability
- Code follows MVC pattern (Models, Controllers, Routes separated)
- Reusable React components (Navbar, Footer, ProtectedRoute, ScrollToTop)
- Global CSS design system (Tailwind + custom utility classes in index.css)
- `.env` file for all configuration values

#### NFR-06: Scalability
- Stateless JWT authentication allows horizontal scaling
- MongoDB Atlas can be upgraded as data grows
- RESTful API design allows easy addition of new endpoints

---

## 5. DATABASE DESIGN

### 5.1 Collections

#### Collection: `users`
```
Field         | Type     | Constraints                       | Notes
---------------------------------------------------------------------------
_id           | ObjectId | Auto-generated                    | Primary Key
name          | String   | Required, max 50 chars, trimmed   |
email         | String   | Required, unique, lowercase       | Indexed
password      | String   | Required, min 6, select: false    | bcrypt hashed
phone         | String   | Optional, trimmed                 |
role          | String   | Enum: ["user","admin"]            | Default: "user"
createdAt     | Date     | Auto-generated (timestamps)       |
updatedAt     | Date     | Auto-generated (timestamps)       |
```
*Pre-save hook: hashes password with bcrypt (salt=12) before save*

#### Collection: `menus`
```
Field         | Type     | Constraints            | Notes
-------------------------------------------------------------------
_id           | ObjectId | Auto-generated         | Primary Key
name          | String   | Required               |
description   | String   | Optional               |
price         | Number   | Required               | In ₹ / $
category      | String   | Required               | Starters/Mains/etc.
image         | String   | Optional               | URL string
available     | Boolean  | Default: true          |
createdAt     | Date     | timestamps             |
updatedAt     | Date     | timestamps             |
```

#### Collection: `orders`
```
Field         | Type      | Constraints                          | Notes
---------------------------------------------------------------------------
_id           | ObjectId  | Auto-generated                       | Primary Key
user          | ObjectId  | Required, ref: "User"                | Foreign Key
orderId       | String    | Unique, auto-generated               | ORD-YYMM-XXXX
items         | Array     | [{ name, quantity, price }]          | Subdocuments
totalAmount   | Number    | Required                             |
status        | String    | Enum: ["Pending","Processing",       | Default: "Pending"
              |           |  "Delivered","Cancelled"]            |
paymentStatus | String    | Enum: ["Pending","Completed",        | Default: "Pending"
              |           |  "Failed"]                           |
createdAt     | Date      | timestamps                           |
updatedAt     | Date      | timestamps                           |
```
*Pre-save hook: auto-generates orderId as `ORD-YYMM-RANDOM4`*

#### Collection: `reservations`
```
Field           | Type     | Constraints                       | Notes
---------------------------------------------------------------------------
_id             | ObjectId | Auto-generated                    | Primary Key
user            | ObjectId | Required, ref: "User"             | Foreign Key
userName        | String   | Optional                          | Denormalized
userEmail       | String   | Optional                          | Denormalized
table           | String   | Optional                          |
date            | String   | Required                          |
time            | String   | Required                          |
guests          | Number   | Required, min:1, max:20           |
specialRequests | String   | Optional, max 500 chars           |
status          | String   | Enum: ["Pending","Confirmed",     | Default: "Pending"
                |          |  "Cancelled"]                     |
bookingId       | String   | Unique, auto-generated            | LUM-TIMESTAMP-RANDOM
createdAt       | Date     | timestamps                        |
updatedAt       | Date     | timestamps                        |
```
*Pre-save hook: auto-generates bookingId as `LUM-TIMESTAMP-RANDOM4`*

#### Collection: `profiles`
```
Field         | Type     | Constraints         | Notes
-----------------------------------------------------------------
_id           | ObjectId | Auto-generated      | Primary Key
user          | ObjectId | ref: "User"         | 1-to-1 Foreign Key
avatar        | String   | Optional            | URL string
bio           | String   | Optional            |
preferences   | Object   | Optional            | Dietary prefs etc.
createdAt     | Date     | timestamps          |
updatedAt     | Date     | timestamps          |
```

### 5.2 Entity Relationship Diagram

```
┌──────────┐        ┌─────────────┐
│  User    │──1:N──▶│ Reservation │
│ _id      │        │ user (ref)  │
│ name     │        │ date, time  │
│ email    │        │ guests      │
│ password │        │ bookingId   │
│ phone    │        └─────────────┘
│ role     │
└──────────┘──1:N──▶┌─────────┐
                     │  Order  │
                     │ user    │
┌──────────┐         │ orderId │
│  Menu    │         │ items[] │
│ name     │         │ status  │
│ price    │         └─────────┘
│ category │
└──────────┘──1:1──▶┌─────────┐
                     │ Profile │
                     │ user    │
                     │ avatar  │
                     │ bio     │
                     └─────────┘
```

---

## 6. API SPECIFICATION

**Base URL:** `http://localhost:5000/api`
**Format:** All requests and responses use `application/json`
**Auth Header:** `Authorization: Bearer <JWT_TOKEN>`

### Standard Response Format
```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
```

---

### 6.1 Auth Endpoints `/api/auth`

#### POST /api/auth/register
- **Access:** Public
- **Request Body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123", "phone": "9876543210" }
```
- **Response 201:**
```json
{ "success": true, "token": "<JWT>", "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" } }
```
- **Error 400:** Email already exists

#### POST /api/auth/login
- **Access:** Public
- **Request Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```
- **Response 200:**
```json
{ "success": true, "token": "<JWT>", "user": { "_id": "...", "name": "...", "email": "...", "phone": "...", "role": "user" } }
```
- **Error 401:** Invalid credentials

#### GET /api/auth/me
- **Access:** Private (JWT required)
- **Response 200:**
```json
{ "success": true, "user": { "_id": "...", "name": "...", "email": "...", "phone": "...", "role": "user" } }
```

---

### 6.2 Menu Endpoints `/api/menu`

#### GET /api/menu
- **Access:** Public
- **Response 200:**
```json
{ "success": true, "count": 12, "data": [ { "name": "Grilled Salmon", "price": 850, "category": "Mains", ... } ] }
```

#### GET /api/menu/:id
- **Access:** Public
- **Response 200:** Single menu item object

---

### 6.3 Reservation Endpoints `/api/reservations`

#### POST /api/reservations
- **Access:** Private
- **Request Body:**
```json
{ "date": "2026-04-10", "time": "19:00", "guests": 4, "specialRequests": "Window seat please" }
```
- **Response 201:**
```json
{ "success": true, "data": { "bookingId": "LUM-M1XABCD-EFGH", "status": "Pending", ... } }
```

#### GET /api/reservations/my
- **Access:** Private
- **Response 200:** Array of user's reservations

#### PATCH /api/reservations/:id/cancel
- **Access:** Private
- **Response 200:** Updated reservation with status "Cancelled"

---

### 6.4 Order Endpoints `/api/orders`

#### POST /api/orders
- **Access:** Private
- **Request Body:**
```json
{ "items": [ { "name": "Grilled Salmon", "quantity": 2, "price": 850 } ], "totalAmount": 1700 }
```
- **Response 201:**
```json
{ "success": true, "data": { "orderId": "ORD-2604-X7KA", "status": "Pending", ... } }
```

#### GET /api/orders/my
- **Access:** Private
- **Response 200:** Array of user's orders

---

### 6.5 Profile Endpoints `/api/profile`

#### GET /api/profile
- **Access:** Private
- **Response 200:** User profile object

#### PUT /api/profile
- **Access:** Private
- **Request Body:**
```json
{ "name": "John Updated", "phone": "9999999999", "bio": "Food lover", "avatar": "https://..." }
```
- **Response 200:** Updated profile object

---

### 6.6 Health Endpoint `/api/health`

#### GET /api/health
- **Access:** Public
- **Response 200:** `{ "success": true, "message": "Server is running" }`

---

## 7. USER INTERFACE REQUIREMENTS

### 7.1 Pages Overview

| Page | Route | Authentication | Description |
|------|-------|---------------|-------------|
| Home | `/` | Not required | Hero, features, popular dishes, CTA sections |
| Menu | `/menu` | Not required | Grid of dishes, category filter tabs |
| Login | `/login` | Not required (redirect if logged in) | Login form with floating labels |
| Register | `/register` | Not required | Register form with floating labels |
| Table | `/table` | Required | Date/time/guests picker for reservation |
| Cart | `/cart` | Required | Cart items with quantity controls |
| Checkout | `/checkout` | Required | Order summary + place order button |
| Profile | `/profile` | Required | User info editor + reservation history |
| Order Status | `/order-status` | Required | Search by order ID, show status |
| About/Contact | `/about` | Not required | Story, team, contact form, embedded map |

### 7.2 UI Design System

- **Color Palette:**
  - Primary/Brand: `#ee7c2b` (amber-orange)
  - Background Dark: `#0d0d0d` / `bg-dark`
  - Card Background: `rgba(34, 24, 16, 0.7)` (mahogany glass)
  - Input Background: `#1a120b` (deep mahogany)
  - Text Primary: `#ffffff`
  - Text Secondary: `#78716c` (stone-500)

- **Typography:** Be Vietnam Pro (primary), fallback sans-serif

- **Component Classes (Custom CSS):**
  - `.glass-card` — glassmorphism card style
  - `.input-floating-label` — Google-style floating label inputs
  - `.btn-primary` — primary CTA button
  - `.section-label` — orange small-caps section tag
  - `.section-title` — large section heading

- **Animations:** Framer Motion used for:
  - Scroll-triggered section reveal (fadeUp variants)
  - Page load animations
  - Hover micro-interactions on cards
  - Button scale animations

### 7.3 Responsive Design

- Mobile-first design using Tailwind CSS breakpoints
- Navbar collapses to hamburger menu on mobile
- Grid layouts switch from multi-column to single-column on small screens
- Map section spans full width on all screen sizes

---

## 8. USE CASES

### UC-01: User Registration

| Field | Details |
|-------|---------|
| **Actor** | Guest |
| **Precondition** | User is not logged in |
| **Main Flow** | 1. User navigates to `/register` → 2. Fills in Name, Email, Password → 3. Clicks Register → 4. System validates input → 5. Sends POST /api/auth/register → 6. Server hashes password, creates user, returns JWT → 7. Frontend stores token in localStorage + AuthContext → 8. User is redirected to Home |
| **Alternate Flow** | Email already exists → Server returns 400 → Form shows error message |
| **Postcondition** | User is logged in with a valid JWT token |

### UC-02: Book a Table

| Field | Details |
|-------|---------|
| **Actor** | Registered User |
| **Precondition** | User is logged in |
| **Main Flow** | 1. User goes to `/table` → 2. Selects date, time, number of guests → 3. Optionally adds special requests → 4. Clicks Book → 5. POST /api/reservations → 6. Server creates reservation with auto-generated bookingId → 7. Success message shown with booking reference |
| **Alternate Flow** | Not logged in → Redirected to /login first |
| **Postcondition** | Reservation with status "Pending" stored in DB |

### UC-03: Place Food Order

| Field | Details |
|-------|---------|
| **Actor** | Registered User |
| **Precondition** | User is logged in, cart has items |
| **Main Flow** | 1. User browses `/menu` → 2. Adds items to cart → 3. Goes to `/cart` → 4. Proceeds to `/checkout` → 5. Reviews order summary → 6. Clicks "Place Order" → 7. POST /api/orders → 8. Server creates order, generates orderId → 9. Cart is cleared → 10. Confirmation shown with orderId |
| **Postcondition** | Order stored in DB with status "Pending" |

### UC-04: Track Order

| Field | Details |
|-------|---------|
| **Actor** | Registered User |
| **Precondition** | User has a valid order ID |
| **Main Flow** | 1. User goes to `/order-status` → 2. Enters order ID (e.g., ORD-2604-X7KA) → 3. Clicks Track Order → 4. GET /api/orders/:id → 5. System displays order details with current status |
| **Alternate Flow** | Invalid ID → Error message "Order not found" |

### UC-05: Update Profile

| Field | Details |
|-------|---------|
| **Actor** | Registered User |
| **Precondition** | User is logged in |
| **Main Flow** | 1. User goes to `/profile` → 2. Sees current info → 3. Edits name/phone/bio → 4. Clicks Save → 5. PUT /api/profile → 6. Server updates profile → 7. Success toast shown |

---

## 9. CONSTRAINTS & LIMITATIONS

| Constraint | Description |
|-----------|-------------|
| **No Payment Gateway** | Checkout simulates order placement without real payment processing |
| **MongoDB Atlas Free Tier** | 512MB storage limit, shared cluster (may have cold starts) |
| **No Real-time Updates** | Order status does not update in real-time (no WebSocket/SSE) |
| **Image Storage** | No image upload — only URL strings stored (relies on external URLs) |
| **Email Notifications** | No email sending for booking confirmation or order updates |
| **Single Currency** | Price displayed without multi-currency support |
| **Admin Panel** | No admin interface to manage orders, reservations, or menu items through UI |
| **Session Expiry** | JWT tokens expire as configured — users must log in again after expiry |

---

## APPENDIX A — Environment Variables

```
# Backend .env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lumiere
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
JWT_EXPIRE=30d
```

## APPENDIX B — NPM Scripts

### Backend
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start with node (production)
npm run seed    # Seed menu data to MongoDB
```

### Frontend
```bash
npm run dev     # Start Vite dev server (port 5173)
npm run build   # Build for production
npm run preview # Preview production build
```

---

*End of SRS Document — Lumière Fine Dining Restaurant Web Application*
*Version 1.0 | April 2026 | Manan Vasani*
