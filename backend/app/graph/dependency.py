"""Graph algorithms over the clause DAG.

- find_cycles: circular references / drafting loops (Tarjan SCC).
- blast_radius: clauses transitively dependent on a clause — powers the
  scoped-refusal completeness gate.
- effective_clause: what a clause means after override edges.
- completeness_gate: missing external documents → evidence gaps.
"""

import networkx as nx

from app.constants import EdgeType


def find_cycles(graph: nx.DiGraph) -> list[dict]:
    """Every SCC of size > 1 is a drafting loop; suggest breaking the
    weakest edge (a plain REFERENCES beats severing an override)."""
    cycles = []
    for component in nx.strongly_connected_components(graph):
        if len(component) < 2:
            continue
        sub = graph.subgraph(component)
        edges = [
            {
                "source": graph.nodes[u]["clause_ref"],
                "target": graph.nodes[v]["clause_ref"],
                "edge_type": d["edge_type"],
                "trigger_text": d.get("trigger_text", ""),
            }
            for u, v, d in sub.edges(data=True)
        ]
        weakest = next(
            (e for e in edges if e["edge_type"] == EdgeType.REFERENCES),
            edges[0] if edges else None,
        )
        cycles.append(
            {
                "clauses": sorted(graph.nodes[n]["clause_ref"] for n in component),
                "edges": edges,
                "suggested_break": weakest,
            }
        )
    return cycles


def blast_radius(graph: nx.DiGraph, clause_id: str) -> set[str]:
    """The clause itself plus every clause that can reach it — i.e. whose
    meaning transitively depends on it."""
    if clause_id not in graph:
        return set()
    return {clause_id} | nx.ancestors(graph, clause_id)


def effective_clause(graph: nx.DiGraph, clauses_by_id: dict[str, dict], clause_id: str) -> dict:
    """Base text plus every clause that overrides or subordinates it."""
    base = clauses_by_id[clause_id]
    overridden_by, subordinate_to = [], []
    if clause_id in graph:
        for source, _, data in graph.in_edges(clause_id, data=True):
            if data["edge_type"] == EdgeType.OVERRIDES:
                overridden_by.append(_edge_view(clauses_by_id, source, data))
        for _, target, data in graph.out_edges(clause_id, data=True):
            if data["edge_type"] == EdgeType.SUBORDINATE_TO:
                subordinate_to.append(_edge_view(clauses_by_id, target, data))
    return {
        "clause_ref": base["clause_ref"],
        "base_text": base["text"],
        "overridden_by": overridden_by,
        "subordinate_to": subordinate_to,
        "is_modified": bool(overridden_by or subordinate_to),
    }


def completeness_gate(
    graph: nx.DiGraph,
    clauses_by_id: dict[str, dict],
    external_refs: list[dict],
    documents: list[dict],
) -> list[dict]:
    """Match referenced external documents against the uploaded set; for
    each missing one, compute the blocked-clause blast radius."""
    uploaded = " || ".join(f"{d.get('title', '')} {d.get('filename', '')}" for d in documents).lower()
    gaps: list[dict] = []
    by_name: dict[str, list[dict]] = {}
    for ref in external_refs:
        by_name.setdefault(ref["name"], []).append(ref)

    for name, refs in by_name.items():
        present = name.lower() in uploaded
        if present:
            continue
        blocked: set[str] = set()
        for ref in refs:
            blocked |= blast_radius(graph, ref["clause_id"])
        gaps.append(
            {
                "missing_document": name,
                "referenced_from": sorted(
                    {clauses_by_id[r["clause_id"]]["clause_ref"] for r in refs if r["clause_id"] in clauses_by_id}
                ),
                "blocked_clause_ids": sorted(blocked),
                "blocked_clause_refs": sorted(
                    {clauses_by_id[c]["clause_ref"] for c in blocked if c in clauses_by_id}
                ),
                "resolved": False,
            }
        )
    return gaps
