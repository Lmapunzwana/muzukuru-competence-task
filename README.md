# Full-Stack To-Do Application

Implemented full-stack competency task with:
- FastAPI backend with JWT bearer auth and user-scoped Todo CRUD.
- React + TypeScript frontend with protected route, login/register, and Todo management.

## Run locally with Docker (Alpine-based)
```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Backend
```bash
cd backend
pip install -r requirements-dev.txt
pytest
uvicorn main:app --reload --port 8000
```

## Frontend
```bash
cd frontend
npm install
npm test
npm run dev
```

## Test suites

### Backend
- Unit: `pytest tests/unit`
- Integration: `pytest tests/integration`
- End-to-end: `pytest tests/e2e`

### Frontend
- Unit: `npm run test:unit`
- Integration: `npm run test:integration`
- End-to-end (component-level user flow): `npm run test:e2e`
