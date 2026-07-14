"""Optional Neo4j mirroring of the clause graph.

The platform runs fully on the in-process graph; when NEO4J_URI is set,
the graph is mirrored for external exploration. Import of the driver is
lazy so the neo4j package is only needed when the feature is on.
"""

from app.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


async def mirror_graph(nodes: list[dict], edges: list[dict]) -> bool:
    settings = get_settings()
    if not settings.neo4j_uri:
        return False
    try:
        from app.db.neo4j import get_driver

        driver = get_driver()
        async with driver.session() as session:
            for node in nodes:
                await session.run(
                    "MERGE (c:Clause {id: $id}) SET c.clause_ref = $clause_ref, c.clause_type = $clause_type",
                    node,
                )
            for edge in edges:
                await session.run(
                    "MATCH (a:Clause {id: $source}), (b:Clause {id: $target}) "
                    "MERGE (a)-[r:" + edge["edge_type"] + "]->(b) SET r.trigger_text = $trigger_text",
                    edge,
                )
        return True
    except Exception as exc:  # mirroring must never break the pipeline
        logger.warning(f"Neo4j mirroring skipped: {exc}")
        return False
