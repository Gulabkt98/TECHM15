"""Builds the clause dependency graph (in-process networkx DiGraph).

Nodes are clause IDs (attributes: ref, type, document); edges are typed
per app.constants.EdgeType. The graph is rebuilt from relational state on
demand — cheap for contract-sized graphs and always consistent with the DB.
Neo4j mirroring is optional deployment sugar, not a runtime dependency.
"""

import networkx as nx

from app.utils.logger import get_logger

logger = get_logger(__name__)


def build_graph(clauses: list[dict], edges: list[dict]) -> nx.DiGraph:
    """clauses: rows with id/clause_ref/section_ref/document_id.
    edges: rows with source_clause_id/target_section_ref/edge_type/trigger_text.
    Targets are resolved by section_ref within the same document.
    """
    graph = nx.DiGraph()
    by_doc_section: dict[tuple[str, str], str] = {}
    for clause in clauses:
        graph.add_node(
            clause["id"],
            clause_ref=clause["clause_ref"],
            section_ref=clause["section_ref"],
            clause_type=clause.get("clause_type", "other"),
            document_id=clause["document_id"],
        )
        by_doc_section[(clause["document_id"], clause["section_ref"])] = clause["id"]

    doc_of = {c["id"]: c["document_id"] for c in clauses}
    resolved = 0
    for edge in edges:
        source = edge["source_clause_id"]
        target = edge.get("target_clause_id") or by_doc_section.get(
            (doc_of.get(source, ""), edge.get("target_section_ref", ""))
        )
        if target and target in graph and source in graph:
            graph.add_edge(source, target, edge_type=edge["edge_type"], trigger_text=edge.get("trigger_text", ""))
            resolved += 1

    logger.info("Clause graph built", extra={"nodes": graph.number_of_nodes(), "edges": resolved})
    return graph


def export_graph(graph: nx.DiGraph) -> dict:
    """Serialise for the React Flow explorer."""
    return {
        "nodes": [
            {"id": node, **{k: data[k] for k in ("clause_ref", "clause_type", "document_id")}}
            for node, data in graph.nodes(data=True)
        ],
        "edges": [
            {"source": u, "target": v, "edge_type": d["edge_type"], "trigger_text": d.get("trigger_text", "")}
            for u, v, d in graph.edges(data=True)
        ],
    }
