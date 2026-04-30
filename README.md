# muzukuru-competence-task

# Full-Stack Auth Demo (Python + React + TypeScript)

## Overview

A minimal full-stack application demonstrating authentication flow and protected route access. The system consists of a Python-based REST API and a React (TypeScript) single-page frontend. The focus is on protocol correctness, strict typing, and predictable state management rather than feature breadth.

## Architecture

### Backend

* Python 3 (Flask or FastAPI)
* REST API endpoints:

  * `POST /register` — create user accounts with securely stored credentials
  * `POST /login` — authenticate users and return a token (mock JWT)
  * `GET /protected` — validate token and return protected data
* Token-based authentication via `Authorization: Bearer <token>`
* CORS configured for `http://localhost:3000`
* Request and error logging to `app.log` using Python’s logging module

### Frontend

* React 18 + TypeScript
* Core views:

  * Registration page
  * Login page
  * Protected route (authenticated users only)
* Auth flow:

  * Store token after login
  * Include token in headers for protected requests
  * Redirect unauthenticated users
  * Logout clears token and resets state
* State management:

  * `useState` and `useEffect`
  * Strict typing (no `any`)
* UX handling:

  * Loading indicators during async operations
  * Error handling for failed requests (e.g., invalid credentials, 401 responses)
* Minimal responsive styling (CSS or Tailwind)

## Integration

* Frontend communicates with backend via `fetch` or Axios
* All protected requests include the authentication token
* Proper handling of async flows and HTTP error states

## Project Structure

```text
backend/
  app.py
  routes/
  models/
  utils/
  app.log

frontend/
  src/
    api/
    auth/
    pages/
    routes/
    components/
  tsconfig.json
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Key Focus Areas

* Correct implementation of token-based authentication
* Clean separation between API and UI layers
* Strict TypeScript contracts for all data flows
* Deterministic state transitions and route protection
* Robust error and loading state handling

## Scope

This project intentionally limits functionality to authentication and protected route access. It is designed to validate core full-stack competencies including API integration, state management, and type safety.
