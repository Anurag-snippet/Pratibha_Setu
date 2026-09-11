# 🌿 Pratibha Setu — Academia–Industry Collaboration Portal

> A unified platform bridging **Students, Academicians, Institutions, and Industry Partners** for standardized skill assessments, dynamic competency-based matching, internships, faculty development programs, and recruitment pipelines.

---

## 📌 Overview

**Pratibha Setu** solves the gap between academic education and industrial requirements. It empowers students with verified digital portfolios and skill benchmarks, helps academicians monitor student progression and access FDP attachments, allows institutions to track macro placement analytics, and provides industry recruiters with candidate discovery and applicant management.

---

## 🏗️ System Architecture

The project is structured as a full-stack monorepo:

```
├── backend/                  # Node.js + Express.js REST API
│   ├── config/               # Database connection & configurations
│   ├── controllers/          # Business logic & request handling
│   ├── middleware/           # Auth (JWT), validation, rate-limiting, error handling
│   ├── models/               # Mongoose schemas & data models
│   ├── routes/               # API route definitions
│   ├── uploads/              # Multipart file upload storage
│   ├── utils/                # JWT helpers & matching algorithms
│   └── server.js             # API entry point & graceful shutdown
│
└── frontend/                 # React 19 + Vite + TanStack Start (TypeScript)
    ├── src/
    │   ├── components/       # Reusable UI kit & shared layout elements
    │   ├── context/          # Global application & authentication state (AuthContext)
    │   ├── layouts/          # Dashboard & Public page shells
    │   ├── lib/              # API client & utility functions
    │   ├── pages/            # Role-based views (Student, Academician, Industry, Institution)
    │   └── routes/           # TanStack file-based route definitions
    └── public/               # Static assets & SVG favicon
```

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Dynamic Skill Assessment**: Multi-format evaluation (MCQ & rating-based) generating benchmarked radar charts.
- **Smart Opportunity Matching**: Automated percentage match calculation based on assessed skills vs. job requirements.
- **Application Tracking**: Real-time stage tracking (Applied, Shortlisted, Selected, Rejected).
- **Verified Digital Portfolio**: Documented certifications, projects, trials, and achievements.

### 👨‍🏫 For Academicians
- **Student Mentorship & Monitoring**: View student skill distributions and placement stages across courses.
- **Faculty Development Attachments**: Apply for research calls, industrial training attachments, and FDPs.

### 🏭 For Industry Partners
- **Opportunity Publisher**: Create internships, jobs, workshops, and training attachments with specific skill requirements.
- **Recruiter Funnel**: Review matched applicants with competency scores, filter candidates, and advance hiring stages.

### 🏛️ For Institutions
- **Macro Ecosystem Analytics**: Track institution-wide skill strengths, placement percentages, and department performance.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, TanStack Start & Router |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Recharts (Radar, Bar Charts) |
| **Backend Runtime** | Node.js, Express.js |
| **Database & ODM** | MongoDB, Mongoose |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs`, Secure Token Storage |
| **Security & Middleware** | CORS, Express Rate Limit, Cookie Parser, Express Validator |

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** (v9+)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# (Ensure .env exists with your MongoDB URI and JWT Secret)
```

#### Environment Variables (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/pratibha_setu
JWT_SECRET=pratibha_setu_secret_key_production_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080,http://localhost:5173
```

```bash
# Optional: Seed initial database categories
npm run seed

# Start backend server
npm run dev
```
API will run at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be accessible at `http://localhost:8080` (or `http://localhost:5173`).

---

## 📡 REST API Summary

| Module | Endpoint | Method | Description |
|---|---|---|---|
| **Auth** | `/api/auth/signup` | `POST` | Register a new user (`student`, `academician`, `industry`, `institution_admin`) |
| **Auth** | `/api/auth/login` | `POST` | Authenticate user & receive JWT token |
| **Auth** | `/api/auth/me` | `GET` | Get authenticated user profile |
| **Students** | `/api/students/:id/profile` | `GET` / `PATCH` | Fetch or update student profile |
| **Assessment** | `/api/assessment/questions` | `GET` | Get assessment question bank |
| **Assessment** | `/api/assessment/submit` | `POST` | Submit answers and update student skills |
| **Opportunities**| `/api/opportunities` | `GET` / `POST` | Browse or publish opportunities |
| **Applications** | `/api/applications` | `POST` / `GET` | Apply for roles & track applicant status |
| **Dashboard** | `/api/dashboard/:role/:id` | `GET` | Analytics & metrics for dashboards |

---

## 📦 Production Deployment

### Backend
1. Deploy to **Render / Railway / AWS EC2 / DigitalOcean**.
2. Set environment variables: `PORT`, `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`.
3. Start command: `npm start`.

### Frontend
1. Deploy to **Vercel / Netlify / Cloudflare Pages**.
2. Build command: `npm run build`.
3. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`.

---

## 📄 License
This project is licensed under the ISC License.
