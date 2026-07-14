"""Authentication endpoints — JWT login/refresh.

TODO(auth): wire to user repository + bcrypt verification; issue JWT with
role claim consumed by the RBAC dependency.
"""

from fastapi import APIRouter

from app.schemas.user import LoginRequest
from app.utils.response import not_implemented

router = APIRouter()


@router.post("/login")
async def login(payload: LoginRequest) -> dict:
    raise not_implemented("Login")


@router.post("/refresh")
async def refresh_token() -> dict:
    raise not_implemented("Token refresh")
