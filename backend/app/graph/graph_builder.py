"""Builds the clause dependency graph in Neo4j.

Nodes: Document, Clause, Table, Obligation, DefinedTerm, ExternalRef.
Edges: the typed EdgeType vocabulary from app.constants.
"""


class GraphBuilder:
    async def build(self, clauses: list[dict], edges: list[dict]) -> dict:
        """Persist nodes/edges; return counts for the audit trail."""
        # TODO(graph): batched MERGE statements via app.graph.neo4j.
        raise NotImplementedError
