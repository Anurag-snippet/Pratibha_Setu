# 🚀 Pratibha Setu — Backend REST API

> **Scalable REST API & Database Layer for the Academia–Industry Collaboration Portal**  
> Built with Node.js, Express.js, MongoDB (Mongoose), and JWT Authentication.

---

## 🌟 Tech Stack

- **Runtime**: Node.js (v18+ / v20+)
- **Framework**: Express.js
- **Database & ODM**: MongoDB with Mongoose (Indexing, compound keys, validation, and aggregation pipelines)
- **Authentication & Security**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`) + `express-rate-limit` + `cors`
- **File Uploads**: `multer` with disk storage and MIME type validation
- **Request Validation**: Schema-level Mongoose validation + `express-validator` pre-route checking
- **Logging & Utilities**: `morgan`, `cookie-parser`, `dotenv`

---

## 📂 Project Structure

```
backend/
├── config/
│   └── db.js                       # Mongoose connection & lifecycle event listeners
├── controllers/                    # MVC Controllers with clean error passing
│   ├── auth.controller.js          # Signup, Login, Me, and Logout
│   ├── student.controller.js       # Profile, Skills, Gap Analysis, Recommendations
│   ├── opportunity.controller.js   # Filtered search, CRUD for industry postings
│   ├── application.controller.js   # Application lifecycle & status tracking
│   ├── assessment.controller.js    # Scoring & skill evaluation pipeline
│   └── dashboard.controller.js     # Role-based chart aggregations
├── middleware/
│   ├── auth.middleware.js          # JWT token verification & role authorization
│   ├── errorHandler.middleware.js  # Mongoose ValidationError, CastError, and 11000 mapper
│   ├── upload.middleware.js        # Multer diskStorage with type/size validation
│   └── validate.middleware.js      # express-validator result handler
├── models/                         # Mongoose Data Models
│   ├── User.js                     # Base auth user (passwordHash select: false)
│   ├── Student.js                  # Student profile with embedded skill subdocuments
│   ├── Academician.js              # Faculty profiles linked to institutions
│   ├── Industry.js                 # Employer profiles & company data
│   ├── Institution.js              # Educational institutions
│   ├── Opportunity.js              # Postings with full-text search indexing
│   ├── Application.js              # Compound unique index { opportunityId: 1, studentId: 1 }
│   ├── PortfolioItem.js            # Certifications, projects, and achievements
│   └── AssessmentQuestion.js       # MCQ and Rating question bank
├── routes/                         # Express Route Definitions
├── utils/
│   ├── tokenUtils.js               # JWT signing and cookie configuration
│   └── matchScore.js               # Skill-overlap matching aggregation pipeline
├── db/
│   └── seed.js                     # Initial database seeding script
├── .env.example
├── package.json
└── server.js                       # Express app entry & graceful shutdown handling
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+ recommended
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/pratibha_setu
JWT_SECRET=pratibha_setu_secret_key_production_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080,http://localhost:5173
```

### 4. Seed Database (Optional)
Populate skill categories, sample assessment questions, and starter data:
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```
The API server will listen on `http://localhost:5000`.

---

## 📡 Core API Endpoints

### 🔐 Auth (`/api/auth`)
- `POST /api/auth/signup` — Create account (`student`, `academician`, `industry`, `institution_admin`)
- `POST /api/auth/login` — Sign in with rate-limiting & receive JWT token
- `GET /api/auth/me` — Retrieve active session user profile *(Protected)*
- `POST /api/auth/logout` — Clear token cookie *(Protected)*

### 👨‍🎓 Students & Assessment (`/api/students`, `/api/assessment`)
- `GET /api/students/:id/profile` — Fetch student profile
- `PATCH /api/students/:id/profile` — Update student bio, course, and year
- `GET /api/students/:id/recommendations` — Scored opportunities ranked by skill overlap
- `GET /api/assessment/questions` — List competency assessment questions
- `POST /api/assessment/submit` — Submit test answers and compute skill levels

### 💼 Opportunities & Applications (`/api/opportunities`, `/api/applications`)
- `GET /api/opportunities` — Query by type, skill, location, stipend, search keyword, page, limit
- `POST /api/opportunities` — Publish new role *(Industry Only)*
- `POST /api/applications` — Submit application for an opportunity
- `GET /api/applications/student/:studentId` — List student's active applications
- `PATCH /api/applications/:id/status` — Advance candidate stage (`applied`, `shortlisted`, `selected`, `rejected`)

### 📊 Dashboard Analytics (`/api/dashboard`)
- `GET /api/dashboard/student/:id` — Student metrics, radar benchmarks, recommended roles
- `GET /api/dashboard/industry/:id` — Recruitment funnel and active posting stats
- `GET /api/dashboard/institution/:id` — Macro institution-wide skill and placement trends

---

## 🛡️ Error Handling & Security

- **Centralized Error Handler**: Automatically formats Mongoose validation errors, cast errors, and duplicate key codes into clean JSON responses.
- **CORS Protection**: Dynamic origin validation supporting multiple development and production origins.
- **Graceful Shutdown**: Handles `SIGINT` / `SIGTERM` signals for clean MongoDB connection closing.

---

## 📄 License
This project is licensed under the ISC License.
