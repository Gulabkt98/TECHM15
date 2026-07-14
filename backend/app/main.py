"""LexGuard AI — FastAPI application entry point.

Design decision: an explicit app factory (create_app) keeps the module
import-safe for tests and workers, and makes middleware/router wiring
visible in one place instead of scattered side effects.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, chat, compare, contracts, graph, health, reports, risk, upload
from app.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("LexGuard AI starting", extra={"env": settings.app_env})
    yield
    logger.info("LexGuard AI shutting down")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="LexGuard AI",
        description="Enterprise Contract & SOW Risk Analyzer — multi-agent legal intelligence platform.",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_prefix = "/api/v1"
    app.include_router(health.router, prefix=api_prefix, tags=["health"])
    app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["auth"])
    app.include_router(upload.router, prefix=f"{api_prefix}/upload", tags=["upload"])
    app.include_router(contracts.router, prefix=f"{api_prefix}/contracts", tags=["contracts"])
    app.include_router(graph.router, prefix=f"{api_prefix}/graph", tags=["graph"])
    app.include_router(risk.router, prefix=f"{api_prefix}/risk", tags=["risk"])
    app.include_router(compare.router, prefix=f"{api_prefix}/compare", tags=["compare"])
    app.include_router(chat.router, prefix=f"{api_prefix}/chat", tags=["chat"])
    app.include_router(reports.router, prefix=f"{api_prefix}/reports", tags=["reports"])

    return app


app = create_app()
