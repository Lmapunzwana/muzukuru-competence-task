from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


settings = Settings()
