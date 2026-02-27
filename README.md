# OpsHub API

Production-ready REST API built with TypeScript, Express, Prisma, and PostgreSQL.

Designed to demonstrate real-world backend engineering patterns including:

- JWT authentication (access + refresh tokens)
- Role-based access control (RBAC)
- Structured logging
- Pagination and filtering
- Status transition rules
- OpenAPI documentation
- Dockerized Postgres
- Automated tests (Vitest + Supertest)

---

## Tech Stack

- Node.js (ESM)
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT (Access + Refresh tokens)
- Zod (validation)
- Pino (structured logging)
- Swagger (OpenAPI docs)
- Docker + Docker Compose
- Vitest + Supertest

---

## Architecture Overview

```
Client
  ↓
Express API
  ↓
Middleware (Auth, RBAC, Logging, Validation)
  ↓
Service Layer (Business Logic)
  ↓
Prisma ORM
  ↓
PostgreSQL
```

---

## Features

### Authentication

- Register
- Login
- Refresh tokens
- Secure password hashing (bcrypt)
- Hashed refresh tokens stored in DB

### Role-Based Access Control

Roles:

- `admin`
- `manager`
- `user`

Permission hierarchy:

```
admin > manager > user
```

### Tickets Module

- Create tickets
- Assign tickets
- Update tickets
- Enforced status transitions:
  - open → in_progress
  - in_progress → resolved
  - resolved → closed

### Query Features

- Pagination (`page`, `limit`)
- Filtering (`status`, `assigneeId`)
- Search (`q`)

### Observability

- Structured request logging
- Global error handler
- Health check endpoint

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Engineernoob/opshub-api.git
cd opshub-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create `.env` in the root:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/opshub?schema=public

JWT_ACCESS_SECRET=supersecret_access_change_me
JWT_REFRESH_SECRET=supersecret_refresh_change_me

ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_SECONDS=1209600
```

### 4. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Start server

```bash
npm run dev
```

API runs at:

```
http://localhost:4000
```

Health check:

```
GET /health
```

Swagger docs:

```
http://localhost:4000/docs
```

---

## Running Tests

```bash
npm test
```

---

## Project Structure

```
src/
  modules/
    auth/
    users/
    tickets/
  middleware/
  config/
  db/
  utils/
prisma/
tests/
docker-compose.yml
```

---

## Why This Project Exists

This repository demonstrates:

- Backend API design
- Secure authentication flows
- Proper separation of concerns
- Defensive error handling
- Business rule enforcement
- Production-style folder structure
- Containerized database setup

It reflects how I build APIs intended for real deployment environments.

---

## Live

- API: [https://YOUR-RENDER-URL.onrender.com](https://opshub-api.onrender.com)
- Health: [https://YOUR-RENDER-URL.onrender.com/health](https://opshub-api.onrender.com/health)
- Docs: [https://YOUR-RENDER-URL.onrender.com/docs](https://opshub-api.onrender.com/docs)

## Author

Taahirah Denmark  
Software Engineer

GitHub: https://github.com/Engineernoob
