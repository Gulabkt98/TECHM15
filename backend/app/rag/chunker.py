"""Clause-boundary chunking.

Chunks map 1:1 to clause registry entries (never fixed token windows);
oversized clauses split at sentence boundaries, each chunk retaining the
parent clause_ref so retrieval results stay citable.
"""

_MAX_CHARS = 1500


def chunk_clauses(clauses: list[dict]) -> list[dict]:
    chunks = []
    for clause in clauses:
        text = clause["text"]
        if len(text) <= _MAX_CHARS:
            chunks.append({**clause, "chunk_text": text})
            continue
        buffer = ""
        for sentence in text.replace("\n", " ").split(". "):
            if len(buffer) + len(sentence) > _MAX_CHARS and buffer:
                chunks.append({**clause, "chunk_text": buffer.strip()})
                buffer = ""
            buffer += sentence + ". "
        if buffer.strip():
            chunks.append({**clause, "chunk_text": buffer.strip()})
    return chunks
