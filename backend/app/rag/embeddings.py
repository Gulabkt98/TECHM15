"""Sentence-Transformers embedding service (lazy model load)."""

from app.config import get_settings

_model = None


def embed(texts: list[str]) -> list[list[float]]:
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(get_settings().embedding_model)
    return _model.encode(texts, normalize_embeddings=True).tolist()
