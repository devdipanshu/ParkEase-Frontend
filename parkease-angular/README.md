<div align="center">

# 🅿️ ParkEase Web

### *Smart Parking Lot Booking — Frontend*

**A production-grade Angular web application for the ParkEase platform**

---

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Custom-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[**Overview**](#-overview) • [**Tech Stack**](#-tech-stack) • [**Getting Started**](#-getting-started) • [**Project Structure**](#-project-structure) • [**Pages & Features**](#-pages--features) • [**API Integration**](#-api-integration)

</div>

---

## 📖 Overview

**ParkEase Web** is the Angular frontend for the ParkEase platform — a cloud-native parking lot booking system. It connects to the [ParkEase Backend](../README.md) (Spring Boot microservices) via REST APIs through the API Gateway at `:8080`.

The app supports three distinct user roles, each with their own dashboard and feature set:

<table>
<tr>
<td align="center" width="33%">

### 🚗 **DRIVER**
*(Vehicle Owner)*

Search nearby parking <br>
Book a spot in seconds <br>
Check-in & pay online <br>
View booking history

</td>
<td align="center" width="33%">

### 🏢 **MANAGER**
*(Lot Owner)*

Register parking lots <br>
Add & manage spots <br>
Track occupancy live <br>
View lot analytics

</td>
<td align="center" width="33%">

### 👑 **ADMIN**
*(Platform Operator)*

Approve/reject lots <br>
Monitor all activity <br>
Manage users <br>
System-wide analytics

</td>
</tr>
</table>

### 🔄 End-to-End User Journey

```mermaid
flowchart LR
    A[🔐 Login<br/>JWT Token] --> B[🔍 Search<br/>Nearby Lots]
    B --> C[🎯 Select<br/>a Spot]
    C --> D[📝 Book<br/>Reserve Spot]
    D --> E[✅ Check-In<br/>On Arrival]
    E --> F[🚪 Check-Out<br/>Fare Calculated]
    F --> G[💳 Pay<br/>+ Receipt]

    style A fill:#667eea,stroke:#4c51bf,color:#fff
    style B fill:#667eea,stroke:#4c51bf,color:#fff
    style C fill:#667eea,stroke:#4c51bf,color:#fff
    style D fill:#764ba2,stroke:#553c9a,color:#fff
    style E fill:#764ba2,stroke:#553c9a,color:#fff
    style F fill:#f093fb,stroke:#c026d3,color:#fff
    style G fill:#f093fb,stroke:#c026d3,color:#fff
```

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### 🅰️ **Framework & Language**
- **Angular 18** — Component-based SPA framework
- **TypeScript 5.x** — Strongly-typed JavaScript
- **Angular Router** — Client-side routing & guards
- **Angular Forms** — Reactive & template-driven forms
- **Angular HttpClient** — REST API communication
- **RxJS** — Reactive programming & observables

</td>
<td width="50%" valign="top">

### 🎨 **Styling & Tooling**
- **Plain CSS** — Custom stylesheets per component
- **CSS Variables** — Design tokens & theming
- **Angular CLI** — Scaffolding & build toolchain
- **Node.js 18+** — Runtime for Angular CLI
- **npm** — Package management
- **Git + GitHub** — Version control

</td>
</tr>
</table>

---

## 🚀 Getting Started

### 📋 Prerequisites

| # | Tool | Version | Purpose | Download |
|:-:|:--|:--|:--|:--|
| 1 | **Node.js** | 18+ LTS | Angular CLI runtime | [nodejs.org](https://nodejs.org/) |
| 2 | **Angular CLI** | 18.x | Build & serve | `npm install -g @angular/cli` |
| 3 | **Git** | Latest | Version control | [git-scm.com](https://git-scm.com/downloads) |
| 4 | **VS Code** | Latest | Recommended IDE | [code.visualstudio.com](https://code.visualstudio.com/) |

**Verify installations:**
```bash
node --version     # → v18.x.x or higher
ng version         # → Angular CLI: 18.x.x
git --version      # → git 2.x.x
```

> ⚠️ **Important:** Make sure the [ParkEase Backend](../README.md) is fully running before starting the frontend. The API Gateway must be live at `http://localhost:8080`.

---

### 📥 Clone & Install

```bash
git clone https://github.com/<your-username>/parkease.git
cd parkease/parkease-web

npm install
```

---

### ⚙️ Environment Configuration

Update the API base URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'   // API Gateway
};
```

For production builds, update `src/environments/environment.prod.ts` accordingly.

---

### ▶️ Run the App

```bash
ng serve
```

Open your browser at **[http://localhost:4200](http://localhost:4200)**

> 💡 The Angular dev server proxies API calls to the backend at `:8080`. Hot-reload is enabled by default — changes reflect instantly.

---

### 🏗 Build for Production

```bash
ng build --configuration production
```

Output is generated in the `dist/parkease-web/` folder, ready to be served by any static file server (Nginx, Apache, etc.).

---

## 📦 Project Structure

```
parkease-web/
├── src/
│   ├── app/
│   │   ├── core/                        # Singleton services & guards
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts      # Login, register, JWT management
│   │   │   │   ├── vehicle.service.ts   # Vehicle API calls
│   │   │   │   ├── lot.service.ts       # ParkingLot API calls
│   │   │   │   ├── spot.service.ts      # Spot API calls
│   │   │   │   ├── booking.service.ts   # Booking API calls
│   │   │   │   ├── payment.service.ts   # Payment API calls
│   │   │   │   └── analytics.service.ts # Analytics API calls
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts        # Redirect unauthenticated users
│   │   │   │   └── role.guard.ts        # Role-based route protection
│   │   │   └── interceptors/
│   │   │       └── jwt.interceptor.ts   # Auto-attach Bearer token
│   │   │
│   │   ├── shared/                      # Reusable components & pipes
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── footer/
│   │   │   │   ├── loader/
│   │   │   │   └── error-message/
│   │   │   └── pipes/
│   │   │       └── distance.pipe.ts     # Format km distances
│   │   │
│   │   ├── features/                    # Feature modules per role
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── driver/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── search-lots/
│   │   │   │   ├── book-spot/
│   │   │   │   ├── my-bookings/
│   │   │   │   └── payment/
│   │   │   ├── manager/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── my-lots/
│   │   │   │   ├── add-lot/
│   │   │   │   └── manage-spots/
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── approve-lots/
│   │   │       └── analytics/
│   │   │
│   │   ├── app.routes.ts                # All route definitions
│   │   ├── app.component.ts
│   │   └── app.config.ts
│   │
│   ├── environments/
│   │   ├── environment.ts               # Dev config (localhost:8080)
│   │   └── environment.prod.ts          # Prod config
│   │
│   ├── assets/                          # Static files (icons, images)
│   ├── styles.css                       # Global CSS
│   └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧩 Architecture

### 🔁 How the Frontend Connects to Backend

```mermaid
graph TD
    U[👤 User Browser<br/>localhost:4200]

    subgraph Angular["🅰️ Angular App"]
        COMP[Component]
        SVC[Service<br/>HttpClient]
        INT[JWT Interceptor<br/>auto-attach token]
        GUARD[Route Guard<br/>auth + role check]
    end

    subgraph Backend["⚙️ ParkEase Backend"]
        GW[API Gateway<br/>:8080]
        MS[Microservices<br/>:8081 – :8088]
    end

    U --> GUARD
    GUARD --> COMP
    COMP --> SVC
    SVC --> INT
    INT --> GW
    GW --> MS

    classDef angular fill:#fce7f3,stroke:#db2777,color:#831843
    classDef backend fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef user fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e

    class COMP,SVC,INT,GUARD angular
    class GW,MS backend
    class U user
```

### 🛡 Route Protection Strategy

| Route | Guard | Allowed Roles |
|:--|:--|:--|
| `/login`, `/register` | None (public) | Everyone |
| `/driver/**` | `AuthGuard` + `RoleGuard` | `DRIVER` |
| `/manager/**` | `AuthGuard` + `RoleGuard` | `MANAGER` |
| `/admin/**` | `AuthGuard` + `RoleGuard` | `ADMIN` |

### 🔑 JWT Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant APP as 🅰️ Angular App
    participant INT as 🔗 JWT Interceptor
    participant GW as 🚪 API Gateway

    U->>APP: Login with email + password
    APP->>GW: POST /auth/login
    GW-->>APP: JWT token
    APP->>APP: Store token in localStorage
    Note over APP: Every subsequent request...
    APP->>INT: HTTP Request
    INT->>INT: Attach Authorization: Bearer <token>
    INT->>GW: Request with JWT header
    GW-->>APP: Protected resource ✅
```

---

## 📄 Pages & Features

### 🔐 Authentication

| Page | Route | Description |
|:--|:--|:--|
| Login | `/login` | Email + password login, stores JWT |
| Register | `/register` | Sign up as DRIVER or MANAGER |

---

### 🚗 Driver Module

| Page | Route | Description |
|:--|:--|:--|
| Dashboard | `/driver/dashboard` | Overview of active bookings & quick actions |
| Search Lots | `/driver/search` | Find nearby parking using lat/lng + radius |
| Book Spot | `/driver/book/:lotId` | Select a spot & confirm reservation |
| My Bookings | `/driver/bookings` | List of all past & active bookings |
| Check-In | `/driver/checkin/:bookingId` | Mark arrival at the lot |
| Payment | `/driver/payment/:bookingId` | Pay fare after check-out |

---

### 🏢 Manager Module

| Page | Route | Description |
|:--|:--|:--|
| Dashboard | `/manager/dashboard` | Live occupancy & lot summary |
| My Lots | `/manager/lots` | List of all registered lots |
| Add Lot | `/manager/lots/add` | Register a new parking lot |
| Manage Spots | `/manager/lots/:id/spots` | Add, edit, or remove spots |

---

### 👑 Admin Module

| Page | Route | Description |
|:--|:--|:--|
| Dashboard | `/admin/dashboard` | Platform-wide summary & KPIs |
| Approve Lots | `/admin/lots/pending` | Review & approve/reject manager-submitted lots |
| Analytics | `/admin/analytics` | Revenue, bookings, occupancy reports |

---

## 🔌 API Integration

All HTTP calls go through the **API Gateway at `:8080`**. Services use Angular's `HttpClient` with the JWT interceptor auto-attaching the `Authorization` header.

### Base URL

```typescript
// environment.ts
apiBaseUrl: 'http://localhost:8080'
```

### Key API Calls

| Feature | Method | Endpoint |
|:--|:--|:--|
| Register | `POST` | `/auth/register` |
| Login | `POST` | `/auth/login` |
| Search Nearby Lots | `GET` | `/lots/nearby?lat=X&lng=Y&radius=5` |
| Get Spot List | `GET` | `/spots/lot/:lotId` |
| Create Booking | `POST` | `/bookings` |
| Check-In | `PUT` | `/bookings/:id/checkin` |
| Check-Out | `PUT` | `/bookings/:id/checkout` |
| Make Payment | `POST` | `/payments` |
| Approve Lot (Admin) | `PUT` | `/lots/:id/approve` |

### 🔐 Auth Header (auto-attached by interceptor)

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗺 Roadmap

- [x] **Phase 1** — Project setup, routing, auth module (login/register)
- [x] **Phase 2** — Driver module (search, book, check-in/out, pay)
- [x] **Phase 3** — Manager module (lot & spot management)
- [x] **Phase 4** — Admin module (approvals, analytics)
- [x] **Phase 5** — JWT interceptor, route guards, error handling
- [ ] **Phase 6** — Dockerization & Nginx static serving
- [ ] **Phase 7** — PWA support (offline mode, install prompt)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

### ⭐ If this project helped you learn Angular + microservices integration, give it a star!

**Built with 🅰️ Angular and a lot of `ngOnInit()` by the ParkEase team**

[⬆ Back to top](#-parkease-web) • [🔗 Backend README](../README.md)

</div>