"""Clause-boundary chunking.

Chunks map 1:1 to clause registry entries (never fixed token windows),
so every retrieved chunk is citable by clause ref + char offsets.
"""


def chunk_clauses(clauses: list[dict]) -> list[dict]:
    # TODO(rag): split oversized clauses at sentence boundaries while
    # retaining the parent clause_ref and offsets in payload.
    raise NotImplementedError
