from fastapi import APIRouter, Depends

from dependencies import get_current_user
from models.user import User

router = APIRouter(tags=["protected"])


@router.get("/protected")
def protected(current_user: User = Depends(get_current_user)):
    return {"message": "Access granted", "user": {"id": current_user.id, "email": current_user.email}}
