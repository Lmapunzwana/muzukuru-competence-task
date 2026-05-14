import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers.auth import router as auth_router
from routers.protected import router as protected_router
from routers.todos import router as todos_router

logging.basicConfig(filename="app.log", level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Full Stack Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(protected_router)
app.include_router(todos_router)
