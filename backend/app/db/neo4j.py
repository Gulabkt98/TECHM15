"""Neo4j driver management (optional feature — lazy import)."""

from app.config import get_settings

_driver = None


def get_driver():
    global _driver
    if _driver is None:
        from neo4j import AsyncGraphDatabase  # imported only when the feature is on

        settings = get_settings()
        _driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri, auth=(settings.neo4j_user, settings.neo4j_password)
        )
    return _driver


async def close_driver() -> None:
    global _driver
    if _driver is not None:
        await _driver.close()
        _driver = None
