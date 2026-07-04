# PRODIGY_FS_01 — Secure User Authentication System

<div align="center">

![ProdigyAuth Banner](https://img.shields.io/badge/PRODIGY__FS__01-Secure%20Auth-6366f1?style=for-the-badge&logo=shield&logoColor=white)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/atlas)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

**A production-ready, industry-standard authentication system built for the Prodigy InfoTech Full Stack Web Development Internship.**

[Features](#features) · [Tech Stack](#tech-stack) · [Setup](#quick-start) · [API Docs](#api-endpoints) · [Deployment](#deployment)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Dual Tokens** | Short-lived access tokens (15m) + refresh tokens (7d) in httpOnly cookies |
| 🛡️ **bcrypt Hashing** | Passwords hashed with bcrypt at 12 salt rounds — never stored in plain text |
| 🚦 **Rate Limiting** | Brute-force protection: 10 attempts per 15 minutes on auth endpoints |
| 🏠 **Protected Routes** | Frontend route guards + backend middleware protect all sensitive resources |
| 👤 **Role-Based Access** | `user` and `admin` roles with `protect` + `authorize()` middleware stack |
| 🔄 **Silent Token Refresh** | Axios interceptor silently refreshes tokens on 401 — seamless UX |
| 💾 **Remember Me** | Persists session to localStorage; otherwise uses sessionStorage |
| ✅ **Full Validation** | Zod (frontend) + express-validator (backend) with strong password rules |
| 🎨 **Premium Dark UI** | Glassmorphism, gradients, Framer Motion animations, skeleton loaders |
| 📱 **Fully Responsive** | Mobile-first design that works on all screen sizes |

---

## 🏗️ Tech Stack

### Frontend (`client/`)
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** — Utility-first styling
- **React Router DOM 6** — Client-side routing
- **React Hook Form** + **Zod** — Form handling and validation
- **Axios** — HTTP client with interceptors
- **Framer Motion** — Animations
- **React Hot Toast** — Toast notifications

### Backend (`server/`)
- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose** — Database and ODM
- **JSON Web Tokens (JWT)** — Authentication tokens
- **bcryptjs** — Password hashing
- **Helmet** — Security headers
- **Morgan** — HTTP request logging
- **express-rate-limit** — Brute-force protection
- **express-validator** — Input validation
- **cookie-parser** — Cookie parsing

---

## 📁 Project Structure

```
PRODIGY_FS_01/
├── client/                   ← React + Vite Frontend
│   └── src/
│       ├── components/       ← Reusable UI components
│       ├── context/          ← AuthContext (useReducer)
│       ├── hooks/            ← useAuth custom hook
│       ├── layouts/          ← AuthLayout, DashboardLayout
│       ├── pages/            ← Home, Login, Register, Dashboard, Profile, 404
│       ├── routes/           ← ProtectedRoute, PublicRoute
│       ├── services/         ← API service functions
│       └── types/            ← TypeScript interfaces
│
└── server/                   ← Express + TypeScript Backend
    └── src/
        ├── config/           ← Database connection
        ├── controllers/      ← Route handlers
        ├── middleware/        ← Auth, validation, rate limit, error handling
        ├── models/           ← Mongoose User model
        ├── routes/           ← Express routers
        ├── types/            ← TypeScript interfaces
        └── utils/            ← JWT utils, response helpers
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or pnpm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd PRODIGY_FS_01
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/prodigy_auth
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

> **Generate secure secrets:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Authentication Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login and get tokens |
| `POST` | `/auth/logout` | Public | Clear session |
| `POST` | `/auth/refresh` | Public | Refresh access token |
| `GET` | `/auth/profile` | 🔒 Private | Get user profile |
| `PUT` | `/auth/profile` | 🔒 Private | Update user profile |
| `GET` | `/health` | Public | Server health check |

#### Request/Response Examples

**Register** `POST /api/auth/register`
```json
// Request Body
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}

// Response 201
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Login** `POST /api/auth/login`
```json
// Request Body
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

Protected routes require: `Authorization: Bearer <accessToken>`

---

## 🔒 Security Architecture

```
Request → Rate Limiter → Helmet Headers → CORS Check
         ↓
         Input Validation (express-validator)
         ↓
         Auth Middleware (JWT verify)
         ↓
         Controller → Database
```

| Layer | Technology | Protection |
|-------|-----------|------------|
| Headers | Helmet.js | XSS, HSTS, CSP, clickjacking |
| Passwords | bcrypt (12 rounds) | Hash + salt, never stored plain |
| Access Token | JWT (15m) | Short-lived, stateless |
| Refresh Token | JWT (7d) httpOnly cookie | XSS-safe, DB-validated |
| Rate Limiting | express-rate-limit | Brute-force prevention |
| Input | express-validator + Zod | SQL/NoSQL injection prevention |
| CORS | Allowlist | Only trusted origins |

---

## 🌐 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-api.onrender.com`

### Backend → Render
1. Push `server/` to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add all environment variables from `.env.example`

### Database → MongoDB Atlas
1. Create cluster at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create database user with read/write permissions
3. Whitelist Render's IP or use `0.0.0.0/0`
4. Copy connection string to `MONGO_URI`

---

## 📄 License

MIT © 2024 — Built for Prodigy InfoTech Full Stack Web Development Internship

---

<div align="center">
  <p>PRODIGY_FS_01 · Task-01: Secure User Authentication</p>
  <p>Built with ❤️ using React 19, Node.js, Express, MongoDB, and JWT</p>
</div>
