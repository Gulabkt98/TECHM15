"""Graph-layer Cypher execution helpers (driver comes from app.db.neo4j)."""

from app.db.neo4j import get_driver


async def run_cypher(query: str, parameters: dict | None = None) -> list[dict]:
    driver = get_driver()
    async with driver.session() as session:
        result = await session.run(query, parameters or {})
        return [record.data() async for record in result]
