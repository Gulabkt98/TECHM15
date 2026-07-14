"""Graph algorithms over the clause DAG.

- find_cycles: circular references / drafting loops (SCC).
- blast_radius: clauses transitively dependent on a missing external doc
  — powers the scoped-refusal completeness gate.
- effective_clause: override-chain resolution in topological order.
"""


async def find_cycles(family_id: str) -> list[dict]:
    # TODO(graph): SCCs of size > 1 with edge trigger texts + suggested break.
    raise NotImplementedError


async def blast_radius(family_id: str, missing_ref: str) -> list[str]:
    # TODO(graph): transitive dependents of the INCORPORATES edge target.
    raise NotImplementedError


async def effective_clause(clause_id: str) -> dict:
    # TODO(graph): walk OVERRIDES/SUBORDINATE_TO chain + precedence rules.
    raise NotImplementedError
