"""Qdrant persistence for clause vectors with payload filters."""

from app.db.qdrant import CLAUSE_COLLECTION, get_client  # noqa: F401


def upsert_chunks(chunks: list[dict], vectors: list[list[float]]) -> None:
    # TODO(rag): ensure collection, upsert points with payload
    # {family_id, doc_type, clause_ref, clause_type, char offsets}.
    raise NotImplementedError
