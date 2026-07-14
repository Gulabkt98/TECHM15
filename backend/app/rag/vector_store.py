"""Optional Qdrant persistence for clause vectors.

No-op unless QDRANT_URL is configured — lexical retrieval carries the
default path. Never breaks the pipeline when the store is unreachable.
"""

from app.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def upsert_chunks(chunks: list[dict]) -> bool:
    settings = get_settings()
    if not settings.qdrant_url:
        return False
    try:
        from qdrant_client.models import Distance, PointStruct, VectorParams

        from app.db.qdrant import CLAUSE_COLLECTION, get_client
        from app.rag.embeddings import embed

        client = get_client()
        vectors = embed([c["chunk_text"] for c in chunks])
        if CLAUSE_COLLECTION not in {c.name for c in client.get_collections().collections}:
            client.create_collection(
                CLAUSE_COLLECTION,
                vectors_config=VectorParams(size=len(vectors[0]), distance=Distance.COSINE),
            )
        client.upsert(
            CLAUSE_COLLECTION,
            points=[
                PointStruct(
                    id=index,
                    vector=vector,
                    payload={k: chunk.get(k) for k in ("id", "family_id", "clause_ref", "clause_type", "page")},
                )
                for index, (chunk, vector) in enumerate(zip(chunks, vectors))
            ],
        )
        return True
    except Exception as exc:
        logger.warning(f"Qdrant indexing skipped: {exc}")
        return False
