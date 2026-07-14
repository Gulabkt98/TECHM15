"""Centralised configuration via pydantic-settings.

Every environment variable the platform consumes is declared here, once,
with a type and a safe development default. Modules never read os.environ
directly — they depend on Settings, which keeps configuration testable.

Design decision: development defaults require ZERO running infrastructure
(SQLite file DB, in-process graph, lexical retrieval). Production swaps in
Postgres/Neo4j/Qdrant purely through environment variables.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent
_DEFAULT_SQLITE = f"sqlite+aiosqlite:///{(BASE_DIR / 'data' / 'lexguard.db').as_posix()}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Application
    app_env: str = "development"
    secret_key: str = "change-me"
    frontend_url: str = "http://localhost:3000"

    # AI (optional — the deterministic pipeline runs without a key)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-pro"
    embedding_model: str = "sentence-transformers/all-mpnet-base-v2"

    # Databases
    database_url: str = _DEFAULT_SQLITE
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = ""     # empty → lexical retrieval fallback
    neo4j_uri: str = ""      # empty → in-process graph only
    neo4j_user: str = "neo4j"
    neo4j_password: str = ""

    # Storage — local folders now, S3 adapter later without call-site changes
    upload_dir: Path = BASE_DIR / "data" / "uploaded"
    processed_dir: Path = BASE_DIR / "data" / "processed"
    reports_dir: Path = BASE_DIR / "data" / "reports"

    # Auth
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    seed_admin_email: str = "admin@lexguard.ai"
    seed_admin_password: str = "admin123"


@lru_cache
def get_settings() -> Settings:
    return Settings()
