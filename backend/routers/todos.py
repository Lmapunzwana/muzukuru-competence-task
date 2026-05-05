from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.todo import TodoCreate, TodoResponse, TodoUpdate
from services.todo_service import TodoService

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=list[TodoResponse])
def list_todos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return TodoService.get_todos(db, current_user.id)


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return TodoService.create_todo(db, current_user.id, payload.title)


@router.patch("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.completed is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No update fields provided")
    todo = TodoService.update_todo(db, todo_id, current_user.id, payload.completed)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted = TodoService.delete_todo(db, todo_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
