"""Liveness and readiness probes."""

from fastapi import APIRouter

from app.config import get_settings
from app.utils.response import success

router = APIRouter()


@router.get("/health")
async def health() -> dict:
    settings = get_settings()
    return success({"status": "healthy", "env": settings.app_env}, "LexGuard AI is running")
