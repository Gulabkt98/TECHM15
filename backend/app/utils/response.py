"""Standard API response envelope.

Every endpoint returns the same shape so the frontend client can handle
success and error uniformly.
"""

from typing import Any

from fastapi import HTTPException, status


def success(data: Any = None, message: str = "ok") -> dict:
    return {"success": True, "message": message, "data": data}


def not_implemented(feature: str) -> HTTPException:
    """Honest 501 for scaffolded endpoints — LexGuard never fakes a result."""
    return HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail=f"{feature} is not implemented yet.",
    )
