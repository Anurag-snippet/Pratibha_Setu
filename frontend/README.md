# 🎨 Pratibha Setu — Frontend Web Application

> **Modern, Responsive Frontend for the Academia–Industry Collaboration Portal**  
> Built with React 19, TypeScript, TanStack Start & Router, and Tailwind CSS.

---

## 🌟 Overview

The frontend of **Pratibha Setu** provides role-based interfaces for Students, Academicians, Industry Partners, and Institutional Administrators. It features competency radar graphs, dynamic applicant tracking, rich digital portfolios, and seamless integration with the backend REST API.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite + TanStack Start (TypeScript)
- **Routing**: `@tanstack/react-router` (Type-safe file-based routing)
- **State & Data Management**: React Context (`AuthContext`) + TanStack Query (`@tanstack/react-query`)
- **Styling**: Tailwind CSS, Class Variance Authority (`cva`), `tailwind-merge`
- **Charts & Visualizations**: `recharts` (Radar, Bar Charts)
- **Icons**: `lucide-react`
- **Forms & Validation**: `react-hook-form` + `zod`

---

## 📂 Directory Structure

```
frontend/
├── public/                 # Static assets & SVG favicon
│   ├── favicon.svg         # Clean circular leaf brand favicon
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI kit components & navigation
│   │   ├── Navbar.tsx      # Responsive public navigation
│   │   ├── Footer.tsx      # Clean footer layout
│   │   ├── OpportunityCard.tsx # Opportunity presentation card
│   │   └── ui-kit.tsx      # Button, Card, Badge, Modal, Field primitives
│   ├── context/
│   │   └── AuthContext.tsx # User session, JWT tokens, & application state
│   ├── layouts/
│   │   ├── DashboardLayout.tsx # Authenticated shell with sidebar & header
│   │   └── PublicLayout.tsx    # Landing page layout with navigation
│   ├── lib/
│   │   ├── api.ts          # Centralized API service client
│   │   └── utils.ts        # Helper & class concatenation utilities
│   ├── pages/
│   │   ├── public/         # Landing, About, Login, and Opportunities
│   │   ├── student/        # Assessment, Applications, Portfolio, & Dashboard
│   │   ├── academician/    # Opportunities, Students, & Faculty Dashboard
│   │   ├── industry/       # Post Opportunity, Manage Postings, & Applicants
│   │   └── institution/    # Macro Analytics & Students Directory
│   ├── routes/             # TanStack file-based router pages
│   └── styles.css          # Core CSS variables & Tailwind directives
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Configure Environment
Create a `.env` file in the `frontend` folder (or configure your hosting provider's environment settings):

```env
# URL pointing to the running backend API
VITE_API_URL=http://localhost:5000/api
```

### 4. Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:8080` (or `http://localhost:5173`).

---

## 🏗️ Production Build

To build the static optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🎯 Role-Based Route Architecture

| Role | Base Path | Key Features |
|---|---|---|
| **Public** | `/` | Portal landing page, explore opportunities, role sign-in & sign-up |
| **Student** | `/student` | Radar skill chart, assessment test, applications tracker, portfolio builder |
| **Academician** | `/academician` | Faculty attachments, research calls, student roster overview |
| **Industry** | `/industry` | Recruitment funnel, opportunity creation wizard, candidate pipeline |
| **Institution** | `/institution` | Macro placement analytics, skill distributions, student directory |

---

## 📄 License
This project is licensed under the ISC License.
