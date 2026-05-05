# Full-Stack To-Do Application — Project Documentation Pack

**Version:** 1.0  
**Date:** 2026-04-30  
**Author:** Leroy

## TABLE OF CONTENTS

1. [Requirements Document](#1-requirements-document)
   - 1.1 Problem Definition
   - 1.2 User Stories / Intents
   - 1.3 Constraints and Assumptions
2. [Design Document](#2-design-document)
   - 2.1 System Architecture
   - 2.2 Component Breakdown
   - 2.3 API Contracts
   - 2.4 Data Models
   - 2.5 Edge Cases
3. [Task Plan](#3-task-plan)
   - 3.1 Ordered Implementation Steps
   - 3.2 Subtasks Decomposed to Atomic Actions
   - 3.3 Dependency Ordering
   - 3.4 Execution Checklist
4. [Traceability Layer](#4-traceability-layer)

---

## 1. REQUIREMENTS DOCUMENT

### 1.1 Problem Definition

A software engineer competency task requiring a full-stack To-Do application demonstrating proficiency in:

- Secure REST API design (Python 3 backend)
- Single-page React 18+ application (TypeScript frontend)
- Token-based authentication (JWT via `Authorization: Bearer` header)
- Full CRUD for to-do items accessible only to authenticated users
- Integration between frontend and backend via HTTP
- Operational logging and CORS configuration

The application must demonstrate understanding of authentication flows, protected route patterns, async error handling, and clean TypeScript typing — not just working code.

---

### 1.2 User Stories / Intents

| ID | Role | Intent | Acceptance Criteria |
|----|------|--------|---------------------|
| US-01 | Visitor | Register with email + password | POST /register creates user; duplicate email returns 409; password is hashed at rest |
| US-02 | Visitor | Log in with credentials | POST /login returns JWT token; invalid credentials return 401 |
| US-03 | Authenticated User | Access protected content | GET /protected returns user data when token is valid; 401 when token is invalid or absent |
| US-04 | Authenticated User | Create a to-do item | POST /todos creates item scoped to logged-in user |
| US-05 | Authenticated User | View my to-do list | GET /todos returns only items belonging to the current user |
| US-06 | Authenticated User | Mark a to-do as complete | PATCH /todos/:id updates completion status |
| US-07 | Authenticated User | Delete a to-do item | DELETE /todos/:id removes item; returns 404 if item doesn't exist or belongs to another user |
| US-08 | Any User | See loading states | Spinner shown during all async operations |
| US-09 | Any User | See meaningful errors | "Invalid credentials", "Email already registered", network error messages displayed inline |
| US-10 | Authenticated User | Log out | Token cleared from storage; redirected to login page |

> **Note:** The spec only mentions GET /protected as the protected endpoint. US-04 through US-07 extend this into actual To-Do CRUD, which is the stated purpose of the application. A protected route that only says "you are authenticated" is not a To-Do application. These extensions are flagged in Constraints.

---

### 1.3 Constraints and Assumptions

#### Hard Constraints (from spec)
- Backend: Python 3.8+, Flask or FastAPI
- Frontend: React 18+, TypeScript, no `any` types
- Auth: `Authorization: Bearer <token>` header pattern
- Logging: `app.log` via Python `logging` module
- CORS: Allow `http://localhost:3000`
- Submission: GitHub repository link

#### Deliberate Deviations (flagged)

| Deviation | Spec Said | Decision | Reason |
|-----------|-----------|----------|--------|
| JWT implementation | "mock JWT or token" | Real JWT via `PyJWT` | A mock defeats the purpose of the Bearer pattern; `PyJWT` adds zero complexity and demonstrates actual competency |
| Persistence | "data stored over a network" | SQLite (local dev) | Spec is ambiguous; SQLite with SQLAlchemy ORM is appropriate for a single-developer competency task; swap to PostgreSQL for prod by changing one connection string |
| CRUD endpoints | Not specified | Full To-Do CRUD added | A To-Do app with no CRUD is not a To-Do app; GET /protected alone is a hello-world, not a competency demonstration |

#### Assumptions
- No email verification required (registration is immediate)
- Tokens do not need refresh (single-expiry JWT sufficient)
- No pagination required for to-do lists
- No multi-user sharing of to-do items (items are user-scoped)
- Frontend runs on `localhost:3000`, backend on `localhost:8000`
- Python framework choice: **FastAPI** (async-first, auto-docs via Swagger, better typing story than Flask)

---

## 2. DESIGN DOCUMENT

### 2.1 System Architecture

```text
┌──────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                    │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │         React 18 SPA (TypeScript)              │  │
│  │         Vite dev server → localhost:3000        │  │
│  │                                                │  │
│  │  Pages: /register  /login  /todos (protected)  │  │
│  │  State: React Context (AuthContext)            │  │
│  │  HTTP:  Axios with interceptor for Bearer      │  │
│  └────────────────────┬───────────────────────────┘  │
└───────────────────────┼──────────────────────────────┘
                        │ HTTP (localhost:8000)
                        │ Authorization: Bearer <jwt>
┌───────────────────────┼──────────────────────────────┐
│               FASTAPI BACKEND                        │
│                                                      │
│  ┌────────────────────▼───────────────────────────┐  │
│  │              API Layer (Routers)               │  │
│  │  /auth   →  register, login                   │  │
│  │  /todos  →  CRUD (protected)                  │  │
│  │  /protected → token verification              │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼───────────────────────────┐  │
│  │            Service Layer                       │  │
│  │  AuthService  │  TodoService                  │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼───────────────────────────┐  │
│  │         SQLAlchemy ORM → SQLite                │  │
│  │         (swap connection string for Postgres)  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Logging → app.log (Python logging module)           │
│  CORS → localhost:3000                               │
└──────────────────────────────────────────────────────┘
```

**Auth Flow:**
```text
Register:  Client → POST /register (email, password) → hash pw → store user → 201
Login:     Client → POST /login (email, password) → verify hash → sign JWT → return token
Protected: Client → GET /any-protected-route + Bearer token → decode JWT → inject user → respond
```

**Token Storage:** `localStorage` (acceptable for competency task; note: `httpOnly` cookies are production-preferred but add backend complexity not required here).

---

### 2.2 Component Breakdown

#### Backend (FastAPI)

```text
backend/
├── main.py                  # App factory, CORS, logging setup, router registration
├── config.py                # Settings (SECRET_KEY, DB URL, TOKEN_EXPIRE_MINUTES)
├── database.py              # SQLAlchemy engine, SessionLocal, Base
├── models/
│   ├── user.py              # User ORM model
│   └── todo.py              # Todo ORM model
├── schemas/
│   ├── auth.py              # RegisterRequest, LoginRequest, TokenResponse
│   └── todo.py              # TodoCreate, TodoUpdate, TodoResponse
├── routers/
│   ├── auth.py              # POST /register, POST /login
│   ├── protected.py         # GET /protected
│   └── todos.py             # GET, POST /todos | PATCH, DELETE /todos/:id
├── services/
│   ├── auth_service.py      # hash_password, verify_password, create_token, decode_token
│   └── todo_service.py      # CRUD operations
├── dependencies.py          # get_db, get_current_user (JWT decode dependency)
├── exceptions.py            # Custom HTTP exceptions
└── app.log                  # Runtime log output
```

#### Frontend (React + TypeScript)

```text
frontend/
├── src/
│   ├── main.tsx             # React DOM root
│   ├── App.tsx              # Router, AuthProvider wrapper
│   ├── types/
│   │   └── index.ts         # Todo, User, AuthState, ApiError interfaces
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state, login/logout actions, token persistence
│   ├── api/
│   │   └── client.ts        # Axios instance with Bearer interceptor
│   ├── pages/
│   │   ├── RegisterPage.tsx # Registration form
│   │   ├── LoginPage.tsx    # Login form
│   │   └── TodosPage.tsx    # Protected to-do list + CRUD UI
│   ├── components/
│   │   ├── ProtectedRoute.tsx  # Route guard (redirect to /login if no token)
│   │   ├── Spinner.tsx         # Loading indicator
│   │   ├── ErrorMessage.tsx    # Inline error display
│   │   └── TodoItem.tsx        # Single to-do row (toggle + delete)
│   └── styles/
│       └── index.css        # Tailwind imports or global CSS
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

### 2.3 API Contracts

All requests/responses use `Content-Type: application/json`.  
Protected routes require: `Authorization: Bearer <token>`

#### POST /register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response 201:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2026-04-30T10:00:00Z"
}
```

**Response 409** (duplicate email):
```json
{ "detail": "Email already registered" }
```

#### POST /login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Response 401:**
```json
{ "detail": "Invalid credentials" }
```

#### GET /protected

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "message": "Access granted",
  "user": { "id": 1, "email": "user@example.com" }
}
```

#### GET /todos

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "created_at": "2026-04-30T10:05:00Z",
    "user_id": 1
  }
]
```

#### POST /todos

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{ "title": "Buy groceries" }
```

**Response 201:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "created_at": "2026-04-30T10:05:00Z",
  "user_id": 1
}
```

#### PATCH /todos/:id

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{ "completed": true }
```

#### DELETE /todos/:id

**Headers:** `Authorization: Bearer <token>`

**Response 204:** *(no body)*

---

### 2.4 Data Models

#### User (ORM + DB)

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | PK, autoincrement |
| email | String(255) | UNIQUE, NOT NULL, indexed |
| hashed_password | String(255) | NOT NULL |
| created_at | DateTime | NOT NULL, default=utcnow |

#### Todo (ORM + DB)

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | PK, autoincrement |
| title | String(500) | NOT NULL |
| completed | Boolean | NOT NULL, default=False |
| created_at | DateTime | NOT NULL, default=utcnow |
| user_id | Integer | FK → users.id, NOT NULL, indexed |

---

### 2.5 Edge Cases

| # | Scenario | Expected Behaviour |
|---|----------|--------------------|
| EC-01 | Register with already-used email | 409 Conflict; frontend shows "Email already registered" |
| EC-02 | Login with wrong password | 401; frontend shows "Invalid credentials" |
| EC-03 | Access protected route with expired token | 401; frontend clears token and redirects |
| EC-05 | Access another user's todo via PATCH/DELETE | 404 (do not reveal resource exists) |
| EC-07 | Network timeout / backend unreachable | Frontend shows "Network error. Please try again." |

---

## 3. TASK PLAN

### 3.1 Ordered Implementation Steps

1. Project setup
2. Backend core (models/config/database)
3. Backend auth endpoints
4. Backend todos CRUD
5. Frontend scaffold + routing
6. Frontend auth flow
7. Frontend todos UI
8. Integration testing and polish

### 3.2 Subtasks Decomposed to Atomic Actions

- Create monorepo structure: `backend/`, `frontend/`
- Add backend dependencies and environment scaffolding
- Implement SQLAlchemy models and Pydantic schemas
- Implement auth and todos routers/services
- Implement React pages/components with strict TypeScript
- Integrate Axios bearer handling and auth state rehydration
- End-to-end test registration/login/todo/logout paths

### 3.3 Dependency Ordering

```text
Setup → Backend Core → Backend Auth → Backend Todos
       ↘ Frontend Scaffold → Frontend Auth → Frontend Todos
Final stage: Integration tests + polish
```

### 3.4 Execution Checklist

- [ ] Backend and frontend scaffolding complete
- [ ] Auth endpoints implemented and tested
- [ ] Todos CRUD endpoints implemented and tested
- [ ] React routes and protected route flow implemented
- [ ] Loading and error states implemented across async actions
- [ ] README, env example, and gitignore finalized

---

## 4. TRACEABILITY LAYER

| Req ID | Requirement | Design Reference | Implementation Tasks | Code Output |
|--------|-------------|-----------------|---------------------|-------------|
| US-01 | User registration | POST /register contract; User model | Auth schema/router + Register page | `routers/auth.py`, `RegisterPage.tsx` |
| US-02 | User login + token | POST /login + JWT payload | Auth service/router + Login page | `auth_service.py`, `LoginPage.tsx` |
| US-03 | Protected route verification | GET /protected + bearer dependency | `get_current_user`, route guard | `dependencies.py`, `ProtectedRoute.tsx` |
| US-04..US-07 | To-do CRUD | `/todos` contracts + Todo model | Todo service/router + todos UI | `todo_service.py`, `TodosPage.tsx` |
| US-08/US-09 | Loading + errors | Spinner/Error components | UI integration in forms/pages | `Spinner.tsx`, `ErrorMessage.tsx` |
| US-10 | Logout | AuthContext logout + 401 handling | Logout action and interceptor | `AuthContext.tsx`, `client.ts` |

---

*End of document. All sections are self-consistent. Deviations from spec are flagged in §1.3.*
