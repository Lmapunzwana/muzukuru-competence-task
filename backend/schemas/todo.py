from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class TodoCreate(BaseModel):
    title: str

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Title cannot be empty")
        return value.strip()


class TodoUpdate(BaseModel):
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
