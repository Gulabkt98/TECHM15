"""Async SQLAlchemy engine/session management (SQLite dev / Postgres prod).

Lazy initialisation: the API boots without a database; the first session
request creates the engine. FastAPI routes depend on get_session().
"""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import get_settings

_engine = None
_session_factory: async_sessionmaker | None = None


def _get_engine():
    global _engine
    if _engine is None:
        settings = get_settings()
        if settings.database_url.startswith("sqlite"):
            # ensure the data directory exists for the SQLite file
            (settings.upload_dir.parent).mkdir(parents=True, exist_ok=True)
        _engine = create_async_engine(settings.database_url, echo=False)
    return _engine


def _get_factory() -> async_sessionmaker:
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(_get_engine(), class_=AsyncSession, expire_on_commit=False)
    return _session_factory


async def get_session() -> AsyncIterator[AsyncSession]:
    async with _get_factory()() as session:
        yield session


def session_scope() -> AsyncSession:
    """Open a session outside FastAPI DI (workflows, scripts)."""
    return _get_factory()()


async def init_db() -> None:
    """Create tables (dev convenience; Alembic owns prod migrations)."""
    from app.db.models import Base

    async with _get_engine().begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
