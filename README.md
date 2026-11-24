# FixMate — Smart Device & Home Appliance Repair Platform

A full-stack on-demand repair service booking web application developed for **CSE-324 Web Technologies Sessional (Assignment 9)**. FixMate bridges the gap between device owners and certified hardware technicians in Bangladesh with transparent job tracking and a pay-after-service model.

---

## 📌 Student & Project Details
- **Student Name**: Nesar Uddin Ifaj
- **Student ID**: 1119004
- **Department**: Computer Science & Engineering (CSE)
- **Institution**: Bangladesh Army International University of Science and Technology (BAIUST)
- **Course**: CSE-324 Web Technologies Sessional
- **Category**: 006 (Device & Home Appliance Repair)

---

## 🌐 Live Deployment & Source Code
- **Live Client Web App**: [https://fixmate-client-six-xi.vercel.app](https://fixmate-client-six-xi.vercel.app)
- **Live Backend API**: [https://fixmate-server-blond.vercel.app](https://fixmate-server-blond.vercel.app)
- **Client Repository**: [https://github.com/Ifaj-codes/fixmate-client](https://github.com/Ifaj-codes/fixmate-client)
- **Server Repository**: [https://github.com/Ifaj-codes/fixmate-server](https://github.com/Ifaj-codes/fixmate-server)

---

## 🔑 Test Credentials for Evaluation

| Role | Email Address | Password | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Admin123#` | Moderate technician service listings, manage user roles, audit bookings & payments |
| **Technician** | `rahim.tech@fixmate.com` | `Tech123#` | Add repair services, toggle availability, accept/reject requests, advance pipeline, set final bill |
| **Technician 2** | `karim.repair@fixmate.com` | `Tech123#` | AC & Refrigerator specialist |
| **Customer** | `customer@fixmate.com` | `User123#` | Browse services, submit repair bookings, track status, pay via Stripe card simulation, leave ratings |

*Note: The Sign In page has a 1-click test credential button to quickly populate the form for testing.*

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 (App Router architecture)
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner Toaster
- **Theme**: Light / Dark Mode support (`next-themes`)
- **PDF Generation**: jsPDF (official downloadable receipts)

### Backend (Server)
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB (Atlas connection with local fallback store)
- **Security & Auth**: JWT (JSON Web Tokens) with custom role-based middlewares
- **Payment Processing**: Stripe Checkout integration & simulated card flow

---

## 🚀 Key Functional Modules

### 1. Public Service Catalog
- Server-side search by service title or keywords.
- Dynamic filtering by category (`Smartphone`, `Laptop & PC`, `AC`, `Refrigerator`, `TV`, `Washing Machine`, `Electrical`) and service mode (`Doorstep Visit`, `Workshop Pickup`).
- Multi-criteria sorting (Price: Low to High, High to Low, Newest).
- Category badges on the home page pre-filter the catalog upon clicking.

### 2. Customer Booking & Tracking Workflow
- Send repair request with preferred date, contact phone, and service address.
- Ticket number auto-generation (`Ticket #FM-XXXX`).
- Filter bookings by status: `All`, `Active`, `To pay`, `Paid`, `Closed`.
- Real-time 5-step visual Timeline Tracker:
  `Requested` → `Accepted` → `In Progress` → `Completed` → `Paid`.
- 1-5 Star Rating & Review submission unlocked once payment is confirmed.

### 3. Technician Workspace
- Overview dashboard with 4 metric cards (`Total services`, `Approved services`, `Pending requests`, `Total earnings`).
- Direct service catalog management with CRUD operations (Add, Edit, Delete).
- Public availability toggle switch with instant status notifications.
- Pipeline management: Accept/Decline incoming requests, start work, and set final verified bill amount upon completion.

### 4. Admin Management Dashboard
- Moderate newly submitted technician repair listings (`Approve` or `Reject`).
- Role assignment and moderation (`customer` ↔ `technician` ↔ `admin`).
- Real-time platform revenue and transaction ledger.

---

## 💻 Local Development Setup

### 1. Clone Repositories
```bash
git clone https://github.com/Ifaj-codes/fixmate-client.git
git clone https://github.com/Ifaj-codes/fixmate-server.git
```

### 2. Backend Setup
```bash
cd fixmate-server
npm install
npm run seed      # Populates test users, approved services, and demo bookings
npm run dev       # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd fixmate-client
npm install
npm run dev       # Starts Next.js app on http://localhost:3000
```

---

## 👤 Developer Contact
- **Nesar Uddin Ifaj**
- Student ID: 1119004 | Section A | Group G1
- Email: `nesaruddinifaj@gmail.com`
- GitHub: [https://github.com/Ifaj-codes](https://github.com/Ifaj-codes)
- LinkedIn: [https://www.linkedin.com/in/nesar-uddin-ifaj-0a8567446](https://www.linkedin.com/in/nesar-uddin-ifaj-0a8567446)
- Facebook: [https://www.facebook.com/share/1ADnRjbHhh/](https://www.facebook.com/share/1ADnRjbHhh/)
