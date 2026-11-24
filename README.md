# FixMate — Smart Device & Home Appliance Repair Service Platform

FixMate is a modern full-stack on-demand repair service booking platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Express.js**, **MongoDB**, **BetterAuth & JWT**, and **Stripe**.

## 🌟 Project Purpose & Core Workflow
In Bangladesh and worldwide, people struggle to find a trustworthy repair technician. After handing over a device, customers have no visibility into what is happening and often pay before any work is delivered. FixMate solves both problems:
1. **Pay-After-Service Model**: Customers never pay in advance. The Stripe Checkout button unlocks only after the technician marks the job completed and sets the final verified price.
2. **Transparent Job Status Pipeline**: Every job moves through strict status stages (`Requested` → `Accepted` → `In Progress` → `Completed` → `Paid`).
3. **Verified Specialist Catalog**: Technicians list certified repair offerings, which require administrative moderation before appearing on public search listings.

---

## 🛠️ Tech Stack & Key NPM Packages

### Frontend
- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: `lucide-react`
- **Toasts**: `sonner`
- **Theming**: `next-themes` (Seamless Dark / Light Mode)
- **PDF Generation**: `jspdf` (Client-side official invoice generation)

### Backend & Database
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB (Atlas connection with resilient persistent local store fallback)
- **Authentication**: JWT & BetterAuth pattern with role-based middlewares
- **Payment Processing**: Stripe Checkout & Webhooks (Test mode)
- **Media**: ImgBB API for technician service banners & user profile photos

---

## 🔑 Test Accounts & Demo Credentials

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Admin123#` | Full system moderation, role management, revenue audit |
| **Technician** | `rahim.tech@fixmate.com` | `Tech123#` | Add services, manage requests, advance pipeline |
| **Technician 2** | `karim.repair@fixmate.com` | `Tech123#` | Cooling & HVAC specialist |
| **Customer** | `customer@fixmate.com` | `User123#` | Request repairs, cancel active jobs, pay via Stripe |

*Tip: The Sign In page features a 1-click credential filler strip for instant testing.*

---

## 🚀 Live Site & Deployment Links
- **Client (Frontend)**: `https://fixmate-client.vercel.app` (or `http://localhost:3000`)
- **Server (Backend API)**: `https://fixmate-server.onrender.com` (or `http://localhost:5000`)

---

## 🏆 All 4 Assignment Challenges Implemented

### Challenge 1: Server-Side Search, Filter & Sort on Browse Services
- Full MongoDB `$regex`, `$match`, and `$sort` queries executed strictly on the server (no client-side `.filter()`).
- Preserves filter state across browser reloads via URL query strings.
- Home page category cards (`/services?category=AC`) open the catalog pre-filtered.

### Challenge 2: JWT Token Verification & Role-Based Middlewares
- Custom Express middlewares: `verifyToken`, `verifyCustomer`, `verifyTechnician`, and `verifyAdmin`.
- 401 Unauthorized for missing/invalid tokens; 403 Forbidden for mismatched roles.
- Customer ID/Email tampering prevention.

### Challenge 3: Server-Enforced Job Status Pipeline & Payment Gate
- Strict state machine: `requested` → `accepted`/`rejected` → `in-progress` → `completed` (with mandatory `finalAmount` > 0).
- Payment gate: checkout session only created for `completed` and `unpaid` bookings owned by logged-in customer.

### Challenge 4: Stripe Webhook & Idempotency
- Raw webhook listener on `/api/payments/webhook` with signature verification.
- `stripeSessionId` uniqueness check guarantees a payment is never saved twice.

---

## 💎 Bonus Features Implemented (5 of 5)
1. **Rating & Review**: 1-5 star rating and comment modal for completed and paid repairs.
2. **Visual Job Timeline Tracker**: Interactive step progression modal (`Requested` → `Accepted` → `In Progress` → `Completed` → `Paid`).
3. **Server-Side Pagination**: Full `.skip()` and `.limit()` pagination controls on `/services`.
4. **PDF Invoice & Receipt Generator**: Downloadable official PDF repair invoices for paid jobs.
5. **Dark & Light Mode**: Smooth theme toggle across all public pages and dashboard workspaces.

---

## 💻 Running Locally

### 1. Backend Setup
```bash
cd fixmate-server
npm install
npm run seed     # Seeds realistic multi-role data
npm run dev      # Starts on port 5000
```

### 2. Frontend Setup
```bash
cd fixmate-client
npm install
npm run dev      # Starts on port 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
