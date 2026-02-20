# EasyChurch 🏛️

A production-ready, full-stack church financial management system for managing income, expenses, members, and generating financial reports.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Default Users](#default-users)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

EasyChurch is a modern church financial management system that enables church administrators, treasurers, and members to collaboratively manage finances with role-based access control. The system provides real-time dashboards, financial reports, member management, and CSV export functionality.

## Features

- 🔐 **Authentication** — JWT-based login/register with role-based access control
- 📊 **Dashboard** — Summary cards, monthly income vs expense chart, recent transactions
- 💰 **Income Module** — Create, edit, delete income with categories and date filtering
- 💸 **Expense Module** — Create, edit, delete expenses with categories and date filtering
- 👥 **Members Management** — Add, edit, delete church members with role assignment
- 📈 **Reports** — Monthly financial reports and CSV export
- 🔒 **Security** — Helmet, CORS, rate limiting, input validation, bcrypt hashing

## Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 18 |
| Vite | 5 |
| TypeScript | 5 |
| React Router | 6 |
| Axios | 1.6 |
| Tailwind CSS | 3 |
| Recharts | 2.10 |

### Backend
| Technology | Version |
|---|---|
| Node.js | 18+ |
| Express | 4.18 |
| TypeScript | 5 |
| PostgreSQL | 14+ |
| Prisma | 5.7 |
| JWT | 9 |
| bcryptjs | 2.4 |

## Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher
- **npm** 9 or higher

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Vladimir-gs/EasyChuch.git
cd EasyChuch
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

### Backend (`backend/.env`)

Copy the example and fill in your values:

```bash
cp backend/.env.example backend/.env
```

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/easychurch` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Database Setup

### 1. Create the PostgreSQL database

```bash
psql -U postgres
CREATE DATABASE easychurch;
\q
```

### 2. Run Prisma Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Seed the Database

```bash
npm run prisma:seed
```

This creates default users, members, income, and expense records.

## Running the Application

### Development

**Backend** (runs on http://localhost:5000):
```bash
cd backend
npm run dev
```

**Frontend** (runs on http://localhost:5173):
```bash
cd frontend
npm run dev
```

### Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx or a static host
```

## API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | None |
| POST | `/auth/login` | Login user | None |
| GET | `/auth/me` | Get current user | Bearer |

**Register/Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": { "id": "...", "email": "...", "name": "...", "role": "MEMBER" },
  "token": "eyJ..."
}
```

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard/summary` | Get financial summary | Bearer |

**Query Parameters:** `startDate`, `endDate` (ISO 8601)

### Income

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/income` | List income (paginated) | All |
| POST | `/income` | Create income | Admin, Treasurer |
| PUT | `/income/:id` | Update income | Admin, Treasurer |
| DELETE | `/income/:id` | Delete income | Admin, Treasurer |

**Query Parameters:** `page`, `limit`, `startDate`, `endDate`, `category`

**Income categories:** `TITHES`, `OFFERINGS`, `DONATIONS`, `EVENTS`

### Expenses

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/expenses` | List expenses (paginated) | All |
| POST | `/expenses` | Create expense | Admin, Treasurer |
| PUT | `/expenses/:id` | Update expense | Admin, Treasurer |
| DELETE | `/expenses/:id` | Delete expense | Admin, Treasurer |

**Expense categories:** `UTILITIES`, `MAINTENANCE`, `SALARIES`, `EVENTS`

### Members

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/members` | List members (paginated) | All |
| POST | `/members` | Create member | Admin |
| PUT | `/members/:id` | Update member | Admin |
| DELETE | `/members/:id` | Delete member | Admin |

### Reports

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/reports/monthly?year=2026&month=2` | Monthly report | Admin, Treasurer |
| GET | `/reports/export?startDate=&endDate=` | Export CSV | Admin, Treasurer |

### Error Response Format

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` — OK
- `201` — Created
- `400` — Bad Request (validation errors)
- `401` — Unauthorized
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `500` — Internal Server Error

## Default Users

After running the seed script, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | admin@easychurch.com | admin123 |
| Treasurer | treasurer@easychurch.com | treasurer123 |
| Member | member@easychurch.com | member123 |

## User Roles

| Role | Dashboard | Income/Expenses | Members | Reports |
|---|---|---|---|---|
| **Admin** | ✅ Read | ✅ Full | ✅ Full | ✅ Full |
| **Treasurer** | ✅ Read | ✅ Full | 👁️ Read | ✅ Full |
| **Member** | ✅ Read | 👁️ Read | 👁️ Read | ❌ None |

## Project Structure

```
easychurch/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Navbar, Layout
│   │   │   ├── common/        # Button, Card, Input, Modal, Toast, Loading
│   │   │   └── features/      # SummaryCard, TransactionList, Forms
│   │   ├── pages/             # Login, Register, Dashboard, Income, Expenses, Members, Reports
│   │   ├── services/          # API service functions
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # helpers, constants
│   │   ├── context/           # AuthContext, ToastContext
│   │   └── hooks/             # useAuth, useToast
│   └── ...config files
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Auth, error, validation
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic
│   │   └── server.ts          # Express app entry point
│   └── prisma/
│       ├── schema.prisma      # Database models
│       └── seed.ts            # Sample data
├── .gitignore
└── README.md
```

## Deployment

### Backend (e.g., Railway, Render, Heroku)

1. Set environment variables in your hosting platform
2. Set `DATABASE_URL` to your production PostgreSQL URL
3. Run `npm run build` in the `backend/` directory
4. Start with `npm start`
5. Run migrations: `npx prisma migrate deploy`

### Frontend (e.g., Vercel, Netlify)

1. Set `VITE_API_URL` to your deployed backend URL
2. Run `npm run build` in the `frontend/` directory
3. Deploy the `frontend/dist/` folder

### Docker (Optional)

You can containerize both services using Docker and docker-compose for a unified deployment.

## Security Notes

- JWT tokens are stored in `localStorage`. For higher security, consider `httpOnly` cookies.
- All passwords are hashed with bcrypt (10 salt rounds).
- Rate limiting is applied: 100 req/15min general, 10 req/15min on auth endpoints.
- Helmet.js adds security headers to all responses.
- All inputs are validated with `express-validator` on the backend.

## License

MIT License — see [LICENSE](LICENSE) for details.
