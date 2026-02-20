# 📅 Weekly Roadmap — Restaurant MERN Project

## 8-Week Execution Schedule

> **Start Date:** February 16, 2026  
> **Target Completion:** April 12, 2026  
> **Stack:** MongoDB · Express.js · React.js · Node.js

---

### Week 1 — Analysis & Planning *(Feb 16 – Feb 22)*

**Goal:** Clear understanding of system requirements

| # | Task | Deliverable |
|---|------|------------|
| 1 | Finalize project idea & scope | Approved topic |
| 2 | Identify stakeholders (Customer, Admin, Owner) | Stakeholder matrix |
| 3 | Write Problem Statement, Objectives, Features List | SRS Section 1 |
| 4 | Prepare SRS draft structure | SRS Introduction + Overall Description |
| 5 | Decide final tech stack (MERN) | Tech stack confirmation |
| 6 | Plan database collections conceptually | Collection sketch |

**✅ Deliverables:** Approved topic · SRS Introduction · Overall Description

---

### Week 2 — System Design *(Feb 23 – Mar 1)*

**Goal:** Complete theoretical design before coding

| # | Task | Deliverable |
|---|------|------------|
| 1 | Create Use-Case Diagram | UML diagram |
| 2 | Write Use-Case Descriptions | Tabular descriptions |
| 3 | Create DFD Level 0 (Context) | DFD-0 diagram |
| 4 | Create DFD Level 1 (Detailed) | DFD-1 diagram |
| 5 | Design ER Diagram (MongoDB collections) | ER diagram |
| 6 | Design System Architecture (3-tier MERN) | Architecture diagram |
| 7 | Plan API endpoints | API documentation |
| 8 | Plan folder structure | Project structure doc |

**✅ Deliverables:** All diagrams · SRS Functional Requirements section

---

### Week 3 — Backend Foundation *(Mar 2 – Mar 8)*

**Goal:** Basic backend running with database connection

| # | Task | Tech |
|---|------|------|
| 1 | Initialize Node.js + Express server | `npm init`, Express |
| 2 | Connect MongoDB using Mongoose | Mongoose, MongoDB Atlas |
| 3 | Create base folder structure | `models/`, `routes/`, `controllers/`, `middleware/` |
| 4 | Implement User model | Mongoose Schema |
| 5 | Implement Menu model | Mongoose Schema |
| 6 | Implement Order model | Mongoose Schema |
| 7 | Implement Reservation model | Mongoose Schema |
| 8 | Test database CRUD using Postman | Postman collection |

**✅ Deliverables:** Working backend server · Database schema finalized

---

### Week 4 — Authentication & Core APIs *(Mar 9 – Mar 15)*

**Goal:** Secure user system + basic APIs

| # | Task | Tech |
|---|------|------|
| 1 | Implement user registration | bcrypt, Mongoose |
| 2 | Implement login with JWT | jsonwebtoken |
| 3 | Implement password hashing | bcrypt (salt rounds: 10) |
| 4 | Build auth middleware | JWT verification |
| 5 | Build Menu fetch API | GET /api/menu |
| 6 | Build Reservation create API | POST /api/reservations |
| 7 | Test all endpoints via Postman | Postman tests |

**✅ Deliverables:** Fully working authentication · Tested REST APIs

---

### Week 5 — Orders, Payments & Admin APIs *(Mar 16 – Mar 22)*

**Goal:** Complete business logic

| # | Task | Tech |
|---|------|------|
| 1 | Implement Cart → Order creation flow | POST /api/orders |
| 2 | Integrate payment gateway (test mode) | Razorpay / Stripe |
| 3 | Implement payment status update | Webhook / callback |
| 4 | Build Admin: Menu CRUD APIs | Protected routes |
| 5 | Build Admin: Order management APIs | Status update endpoints |
| 6 | Build Admin: Reservation management APIs | Approve/reject endpoints |
| 7 | Test complete backend flow end-to-end | Postman + manual |

**✅ Deliverables:** Feature-complete backend

---

### Week 6 — Frontend Development *(Mar 23 – Mar 29)*

**Goal:** Build full user interface & connect APIs

| # | Task | Tech |
|---|------|------|
| 1 | Create/polish Home page | React, CSS |
| 2 | Create/polish Menu page | React, CSS |
| 3 | Create/polish Cart page | React, CSS |
| 4 | Create Table Booking page | React, CSS |
| 5 | Create/polish Login & Register pages | React, CSS |
| 6 | Create Profile page | React, CSS |
| 7 | Create Order Status page | React, CSS |
| 8 | Connect frontend to backend APIs | Axios |
| 9 | Implement global state management | Redux / Zustand |
| 10 | Add animations & responsive polish | Framer Motion, CSS |

**✅ Deliverables:** Fully functional customer UI

---

### Week 7 — Admin Panel, Testing & Debugging *(Mar 30 – Apr 5)*

**Goal:** Stabilize the system

| # | Task | Details |
|---|------|---------|
| 1 | Build Admin Dashboard UI | Charts, tables, stats |
| 2 | Connect admin frontend to APIs | Axios, protected routes |
| 3 | Functional testing (all features) | Manual + automated |
| 4 | UI/UX testing (responsive, cross-browser) | Chrome, Firefox, Edge |
| 5 | Error handling & edge cases | Validation, fallbacks |
| 6 | Bug fixes & performance tuning | Profiling, optimization |

**✅ Deliverables:** Complete working system · End-to-end tested

---

### Week 8 — Documentation & Final Submission *(Apr 6 – Apr 12)*

**Goal:** Prepare for viva + submission

| # | Task | Format |
|---|------|--------|
| 1 | Complete final SRS document | PDF |
| 2 | Finalize all diagrams | PNG / SVG |
| 3 | Write project report | Word / PDF |
| 4 | Capture screenshots of all pages | PNG |
| 5 | Prepare PPT presentation | 15-20 slides |
| 6 | Prepare viva Q&A answers | Document |
| 7 | Write demo script | Step-by-step guide |

**✅ Deliverables:** Final report PDF · Presentation slides · Ready-to-demo project

---

## 🏁 Final Outcome

After 8 weeks you will have:

- ✅ Full MERN restaurant web application  
- ✅ Complete documentation (SRS, diagrams, report)  
- ✅ Working demo for viva  
- ✅ Industry-level project structure  
