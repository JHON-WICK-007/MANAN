# Software Requirements Specification (SRS)

## Restaurant Management Web Application

| | |
|---|---|
| **Document Version** | 1.0 |
| **Date** | February 16, 2026 |
| **Project** | Restaurant Management System |
| **Tech Stack** | MERN (MongoDB, Express.js, React.js, Node.js) |
| **Prepared By** | Manan Vasani |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features (Functional Requirements)](#3-system-features-functional-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Models](#6-system-models)
7. [Future Enhancements](#7-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to provide a complete and detailed description of the requirements for the **Restaurant Management Web Application**. This SRS defines the functional and non-functional requirements of the system, serving as a reference for:

- **Developers** — to design, build, and maintain the system
- **Testers** — to validate system functionality against stated requirements
- **Stakeholders** — to understand the scope and capabilities of the final product
- **Academic Evaluators** — for project assessment and viva examination

The system aims to digitize and streamline core restaurant operations including online food ordering, table reservations, secure payment processing, and administrative management through a modern web-based platform.

### 1.2 Scope

The Restaurant Management Web Application is a full-stack web solution built with the MERN stack that provides the following capabilities:

**In Scope:**

- **Online Food Ordering** — Customers can browse a menu, add items to a cart, and place orders online
- **Table Reservation** — Customers can book tables by selecting date, time, and number of guests
- **Secure Payment Processing** — Integration with a payment gateway (test mode) for online transactions
- **User Authentication** — Secure registration, login, and session management using JWT
- **Admin Dashboard** — Restaurant administrators can manage menu items, orders, reservations, and view analytics
- **Responsive Design** — Fully functional on desktop, tablet, and mobile devices

**Out of Scope:**

- Real-time delivery tracking with GPS hardware
- Physical POS (Point of Sale) terminal integration
- Multi-restaurant/franchise management (single-branch only for v1.0)
- Native mobile applications (iOS/Android)
- Inventory and supply chain management

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| **MERN** | MongoDB, Express.js, React.js, Node.js — the full-stack JavaScript framework |
| **JWT** | JSON Web Token — a standard for secure authentication tokens |
| **API** | Application Programming Interface — a set of protocols for building software |
| **REST** | Representational State Transfer — an architectural style for APIs |
| **UI/UX** | User Interface / User Experience |
| **CRUD** | Create, Read, Update, Delete — basic data operations |
| **SRS** | Software Requirements Specification |
| **HTTP/HTTPS** | HyperText Transfer Protocol / Secure |
| **JSON** | JavaScript Object Notation — lightweight data interchange format |
| **CORS** | Cross-Origin Resource Sharing |
| **bcrypt** | A password hashing algorithm |
| **MongoDB** | A NoSQL document-oriented database |
| **Mongoose** | An Object Data Modeling (ODM) library for MongoDB and Node.js |

### 1.4 References

| Reference | Description |
|-----------|-------------|
| IEEE 830-1998 | IEEE Recommended Practice for Software Requirements Specifications |
| [React Documentation](https://react.dev/) | Official React.js documentation |
| [Node.js Documentation](https://nodejs.org/docs/) | Official Node.js documentation |
| [Express.js Guide](https://expressjs.com/) | Express.js framework documentation |
| [MongoDB Manual](https://www.mongodb.com/docs/manual/) | Official MongoDB documentation |
| [Mongoose Docs](https://mongoosejs.com/docs/) | Mongoose ODM documentation |
| [JWT.io](https://jwt.io/) | JSON Web Token introduction and debugger |
| [Razorpay/Stripe Docs](https://stripe.com/docs) | Payment gateway API documentation |

### 1.5 Overview

The remainder of this SRS document is organized as follows:

- **Section 2** — Provides an overall description of the product including its context, high-level functions, user classes, operating environment, constraints, and assumptions
- **Section 3** — Details all functional requirements organized by system feature
- **Section 4** — Describes external interface requirements (UI, hardware, software, communication)
- **Section 5** — Specifies non-functional requirements including performance, security, usability, reliability, and scalability
- **Section 6** — References system models and diagrams (use-case, DFD, ER, architecture)
- **Section 7** — Lists planned future enhancements beyond the current scope

---

## 2. Overall Description

### 2.1 Product Perspective

The Restaurant Management Web Application is a **self-contained, web-based client–server system** designed to replace manual restaurant management processes with a digital solution.

**System Context:**

```
┌──────────────┐     HTTP/HTTPS     ┌──────────────────┐     Mongoose     ┌──────────┐
│   React.js   │ ◄──── REST API ───►│  Node.js/Express │ ◄──────────────►│ MongoDB  │
│  (Frontend)  │                    │    (Backend)     │                 │(Database)│
│  Port: 5173  │                    │   Port: 5000     │                 │Port:27017│
└──────────────┘                    └──────────────────┘                 └──────────┘
       │                                    │
       │                                    │
  Browser (User)                   Payment Gateway API
```

- The **React.js frontend** renders the UI in the user's browser and communicates with the backend via RESTful API calls
- The **Node.js/Express backend** handles business logic, authentication, and serves as the API server
- **MongoDB** stores all persistent data — users, menu items, orders, reservations, and transactions
- A **payment gateway** (Razorpay/Stripe) handles secure online payment processing in test mode

This is a **3-tier architecture**: Presentation Layer (React) → Application Layer (Express/Node) → Data Layer (MongoDB).

### 2.2 Product Functions (High-Level)

The system provides the following major functions:

1. **User Authentication & Authorization**
   - Secure user registration and login
   - Role-based access control (Customer vs Admin)
   - Session management via JWT

2. **Menu Browsing & Search**
   - Display categorized food items with images, prices, and descriptions
   - Filter by category (Starters, Main Course, Desserts, Beverages)
   - Veg/Non-Veg indicator

3. **Shopping Cart & Order Processing**
   - Add, remove, and update item quantities in cart
   - Real-time total calculation
   - Place order and receive confirmation
   - View order history and status

4. **Table Reservation**
   - Select date, time, and number of guests
   - Check table availability
   - Receive booking confirmation

5. **Payment Processing**
   - Secure online payment via payment gateway
   - Handle payment success and failure scenarios
   - Store transaction records

6. **Admin Dashboard**
   - CRUD operations on menu items
   - View and manage incoming orders (accept/reject/update status)
   - Manage table reservations
   - View basic analytics (total orders, revenue)

### 2.3 User Classes and Characteristics

#### Customer (End User)
| Attribute | Description |
|-----------|-------------|
| **Technical Knowledge** | Basic; familiar with web browsing and online ordering |
| **Access Device** | Mobile phone, tablet, or desktop computer |
| **Frequency of Use** | Occasional to regular |
| **Primary Actions** | Browse menu, place orders, book tables, make payments, view order history |
| **Security** | Standard login with email and password |

#### Administrator (Restaurant Staff/Owner)
| Attribute | Description |
|-----------|-------------|
| **Technical Knowledge** | Moderate; can navigate a dashboard interface |
| **Access Device** | Desktop or tablet |
| **Frequency of Use** | Daily |
| **Primary Actions** | Manage menu, process orders, manage reservations, view reports |
| **Security** | Admin login with elevated privileges, role-based access |

### 2.4 Operating Environment

| Component | Specification |
|-----------|--------------|
| **Client Browser** | Google Chrome (v90+), Mozilla Firefox (v85+), Microsoft Edge (v90+), Safari (v14+) |
| **Frontend** | React.js 18 with Vite build tool |
| **Backend** | Node.js (v18+) with Express.js framework |
| **Database** | MongoDB (v6.0+ or MongoDB Atlas cloud) |
| **Server OS** | Windows 10/11 or Linux (Ubuntu 20.04+) |
| **Hosting** | Local development or cloud (Vercel/Render/Railway) |
| **Package Manager** | npm or yarn |

### 2.5 Design and Implementation Constraints

1. **Technology Constraint** — The system must be built exclusively using the MERN stack (MongoDB, Express.js, React.js, Node.js)
2. **Payment Security** — Payment gateway integration must use secure HTTPS and comply with gateway provider requirements
3. **Responsive Design** — The UI must be fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+) viewports
4. **Authentication** — Must use JWT-based authentication; sessions should expire after a configurable timeout
5. **Password Storage** — User passwords must be hashed using bcrypt before storage; plaintext storage is strictly prohibited
6. **API Architecture** — All backend endpoints must follow RESTful API design principles
7. **Academic Timeline** — The project must be completed within an 8-week semester timeframe

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have access to a stable internet connection
- Users have a modern web browser installed
- The restaurant operates from a single branch/location
- Menu items and prices are managed by the admin in real-time

**Dependencies:**
- **MongoDB Atlas** or local MongoDB instance must be available and accessible
- **Payment gateway API** (Razorpay/Stripe) must be operational in test mode
- **Node.js runtime** must be installed on the development/hosting machine
- **npm packages** — The system depends on third-party libraries (Express, Mongoose, bcrypt, jsonwebtoken, cors, etc.) availability via npm registry

---

## 3. System Features (Functional Requirements)

### 3.1 User Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | The system shall allow new users to register with name, email, phone, and password | High |
| FR-1.2 | The system shall validate email uniqueness during registration | High |
| FR-1.3 | The system shall hash passwords using bcrypt before storing in the database | High |
| FR-1.4 | The system shall allow registered users to log in with email and password | High |
| FR-1.5 | The system shall generate a JWT token upon successful login | High |
| FR-1.6 | The system shall authenticate API requests using JWT middleware | High |
| FR-1.7 | The system shall allow users to log out (clear token from client) | High |
| FR-1.8 | The system shall distinguish between Customer and Admin roles | High |
| FR-1.9 | The system shall display appropriate error messages for invalid login attempts | Medium |

### 3.2 Menu Management (Customer View)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | The system shall display all available menu items with name, image, price, and description | High |
| FR-2.2 | The system shall allow filtering menu items by category (Starters, Main Course, Desserts, Beverages) | High |
| FR-2.3 | The system shall indicate whether each item is Vegetarian or Non-Vegetarian | Medium |
| FR-2.4 | The system shall allow users to search for menu items by name | Medium |
| FR-2.5 | The system shall display items in an organized, visually appealing grid layout | Medium |
| FR-2.6 | The system shall show item availability status (available/unavailable) | Low |

### 3.3 Cart & Order Processing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | The system shall allow users to add menu items to a shopping cart | High |
| FR-3.2 | The system shall allow users to update item quantity in the cart | High |
| FR-3.3 | The system shall allow users to remove items from the cart | High |
| FR-3.4 | The system shall calculate and display the itemized total and grand total in real-time | High |
| FR-3.5 | The system shall allow authenticated users to place an order from the cart | High |
| FR-3.6 | The system shall generate a unique order ID upon successful order placement | High |
| FR-3.7 | The system shall store order details (items, quantities, total, status, timestamp) in the database | High |
| FR-3.8 | The system shall allow users to view their past order history | Medium |
| FR-3.9 | The system shall display real-time order status (Pending → Preparing → Ready → Delivered) | Medium |

### 3.4 Table Reservation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | The system shall allow users to select a reservation date | High |
| FR-4.2 | The system shall allow users to select a reservation time slot | High |
| FR-4.3 | The system shall allow users to specify the number of guests | High |
| FR-4.4 | The system shall check table availability for the requested date/time | High |
| FR-4.5 | The system shall create a reservation record upon successful booking | High |
| FR-4.6 | The system shall display a booking confirmation with details | High |
| FR-4.7 | The system shall allow users to view their active reservations | Medium |
| FR-4.8 | The system shall allow users to cancel a reservation | Medium |

### 3.5 Payment Processing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | The system shall integrate with a payment gateway (Razorpay/Stripe) in test mode | High |
| FR-5.2 | The system shall redirect users to a secure payment page upon checkout | High |
| FR-5.3 | The system shall handle payment success and update order status accordingly | High |
| FR-5.4 | The system shall handle payment failure and display appropriate error messages | High |
| FR-5.5 | The system shall store transaction details (transaction ID, amount, status, timestamp) | High |
| FR-5.6 | The system shall display a payment receipt/confirmation upon success | Medium |

### 3.6 Admin Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | The system shall restrict admin dashboard access to users with the Admin role | High |
| FR-6.2 | The system shall allow admins to add new menu items (name, price, image, category, description) | High |
| FR-6.3 | The system shall allow admins to edit existing menu items | High |
| FR-6.4 | The system shall allow admins to delete menu items | High |
| FR-6.5 | The system shall allow admins to view all incoming orders | High |
| FR-6.6 | The system shall allow admins to update order status (Accept, Preparing, Ready, Delivered) | High |
| FR-6.7 | The system shall allow admins to view all reservations | High |
| FR-6.8 | The system shall allow admins to approve or reject reservations | Medium |
| FR-6.9 | The system shall display basic analytics — total orders, total revenue, active reservations | Medium |
| FR-6.10 | The system shall provide a clean, intuitive dashboard interface | Medium |

---

## 4. External Interface Requirements

### 4.1 User Interface

The frontend shall provide the following pages/views:

| Page | Description |
|------|-------------|
| **Home** | Landing page with hero section, featured dishes, about section, and call-to-action |
| **Menu** | Grid display of all food items with category filters and search |
| **Cart** | List of selected items with quantity controls, pricing, and checkout button |
| **Book Table** | Reservation form with date, time, and guest count selection |
| **Login** | Email and password login form with link to registration |
| **Register** | Registration form with name, email, phone, and password fields |
| **Profile** | User profile with personal info and order history |
| **Order Status** | Real-time order tracking view with status updates |
| **Admin Dashboard** | Protected panel for menu, order, and reservation management |

**UI Requirements:**
- Responsive layout (mobile-first approach)
- Consistent navigation bar across all pages
- Clear visual feedback for user actions (loading states, success/error messages)
- Smooth page transitions and micro-animations
- Accessible color contrast and font sizing

### 4.2 Hardware Interface

- The application runs entirely in a web browser and does **not** require any special hardware
- Compatible with standard input devices (keyboard, mouse, touch screen)
- Works on devices with minimum screen width of 320px
- Requires an active internet connection

### 4.3 Software Interface

| Interface | Purpose |
|-----------|---------|
| **MongoDB / MongoDB Atlas** | Primary database for storing all application data |
| **Mongoose ODM** | Object Data Modeling for MongoDB schema definition and validation |
| **Payment Gateway API** (Razorpay/Stripe) | Processing online payments in test mode |
| **Cloudinary** (optional) | Cloud-based image storage for menu item images |
| **bcrypt** | Password hashing library |
| **jsonwebtoken** | JWT generation and verification |

### 4.4 Communication Interface

| Aspect | Specification |
|--------|--------------|
| **Protocol** | HTTP (development) / HTTPS (production) |
| **Data Format** | JSON (JavaScript Object Notation) |
| **API Style** | RESTful — resource-based URLs with standard HTTP methods (GET, POST, PUT, DELETE) |
| **CORS** | Cross-Origin Resource Sharing enabled for frontend-backend communication |
| **Port (Dev)** | Frontend: 5173 (Vite), Backend: 5000 (Express) |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-1.1 | Page load time shall be under **3 seconds** on a standard broadband connection |
| NFR-1.2 | API response time for standard queries shall be under **500 milliseconds** |
| NFR-1.3 | The system shall handle a minimum of **50 concurrent users** without performance degradation |
| NFR-1.4 | Database queries shall be optimized with proper indexing |

### 5.2 Security

| ID | Requirement |
|----|-------------|
| NFR-2.1 | All user passwords shall be hashed using bcrypt with a minimum salt rounds of 10 |
| NFR-2.2 | Authentication shall use JWT with configurable expiration (default: 24 hours) |
| NFR-2.3 | Admin routes shall be protected with role-based authorization middleware |
| NFR-2.4 | API endpoints shall validate and sanitize all input data to prevent injection attacks |
| NFR-2.5 | Payment data shall be processed through a secure, PCI-compliant payment gateway |
| NFR-2.6 | Sensitive configuration (DB URI, JWT secret, API keys) shall be stored in environment variables |

### 5.3 Usability

| ID | Requirement |
|----|-------------|
| NFR-3.1 | The navigation shall be intuitive — users shall reach any feature within 3 clicks |
| NFR-3.2 | The UI shall be fully responsive across mobile, tablet, and desktop |
| NFR-3.3 | Form fields shall have clear labels and validation messages |
| NFR-3.4 | Loading indicators shall be shown for asynchronous operations |
| NFR-3.5 | Error messages shall be user-friendly and suggest corrective action |

### 5.4 Reliability

| ID | Requirement |
|----|-------------|
| NFR-4.1 | The system shall implement proper error handling for all API endpoints |
| NFR-4.2 | Input data shall be validated on both client-side and server-side |
| NFR-4.3 | Failed payments shall not create orders; the system shall maintain data consistency |
| NFR-4.4 | The system shall gracefully handle database connection failures |
| NFR-4.5 | The system shall maintain uptime of **99%** during demonstration periods |

### 5.5 Scalability

| ID | Requirement |
|----|-------------|
| NFR-5.1 | The backend shall follow a modular architecture (separate routes, controllers, models, middleware) |
| NFR-5.2 | The database schema shall support future collection additions without breaking changes |
| NFR-5.3 | The application shall be deployable to cloud platforms (Vercel, Render, Railway) |
| NFR-5.4 | Environment-specific configurations shall be separated using `.env` files |

---

## 6. System Models

> *The following diagrams will be prepared as part of the System Design phase (Week 2) and appended to this document.*

| Diagram | Purpose | Status |
|---------|---------|--------|
| **Use-Case Diagram** | Shows actor interactions with system features | 📋 Pending |
| **Use-Case Descriptions** | Detailed description of each use-case scenario | 📋 Pending |
| **DFD Level 0** | Context diagram showing system boundaries | 📋 Pending |
| **DFD Level 1** | Detailed data flow between system processes | 📋 Pending |
| **ER Diagram** | MongoDB collection relationships and schema | 📋 Pending |
| **System Architecture Diagram** | 3-tier MERN architecture visualization | 📋 Pending |

---

## 7. Future Enhancements

The following features are planned for future versions beyond v1.0:

1. **Real-Time Order Tracking** — Live status updates using WebSockets (Socket.io)
2. **Email/SMS Notifications** — Order confirmations, reservation reminders via email (Nodemailer) and SMS
3. **Multi-Branch Support** — Extend the system to manage multiple restaurant locations
4. **AI-Powered Recommendations** — Personalized dish suggestions based on order history
5. **Loyalty & Rewards Program** — Points system for repeat customers
6. **Review & Rating System** — Allow customers to rate dishes and leave reviews
7. **Delivery Integration** — Partner with delivery services for home delivery tracking
8. **Progressive Web App (PWA)** — Offline support and installable mobile experience

---

## Appendix A — Weekly Roadmap Summary

| Week | Focus Area | Key Deliverables |
|------|-----------|-----------------|
| 1 | Analysis & Planning | SRS Introduction, Feature List, Scope |
| 2 | System Design | Use-Case, DFD, ER, Architecture Diagrams |
| 3 | Backend Foundation | Express Server, MongoDB, Models |
| 4 | Auth & Core APIs | JWT Auth, Menu & Reservation APIs |
| 5 | Orders & Admin APIs | Cart → Order flow, Payments, Admin CRUD |
| 6 | Frontend Development | All Pages, API Integration, State Management |
| 7 | Admin Panel & Testing | Admin UI, E2E Testing, Bug Fixes |
| 8 | Documentation & Submission | Final Report, PPT, Demo |

---

*Document prepared following IEEE 830-1998 recommended practice for Software Requirements Specifications.*
