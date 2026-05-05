from sqlalchemy.orm import Session
from models.todo import Todo


class TodoService:
    @staticmethod
    def get_todos(db: Session, user_id: int) -> list[Todo]:
        return db.query(Todo).filter(Todo.user_id == user_id).order_by(Todo.created_at.desc()).all()

    @staticmethod
    def create_todo(db: Session, user_id: int, title: str) -> Todo:
        todo = Todo(title=title, user_id=user_id)
        db.add(todo)
        db.commit()
        db.refresh(todo)
        return todo

    @staticmethod
    def update_todo(db: Session, todo_id: int, user_id: int, completed: bool) -> Todo | None:
        todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        if todo is None:
            return None
        todo.completed = completed
        db.commit()
        db.refresh(todo)
        return todo

    @staticmethod
    def delete_todo(db: Session, todo_id: int, user_id: int) -> bool:
        todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        if todo is None:
            return False
        db.delete(todo)
        db.commit()
        return True
