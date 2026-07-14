"""Retrieval over the clause registry.

Default path is a dependency-free lexical scorer (TF × IDF with title
boost) over the family's clauses — deterministic and infrastructure-free.
When Qdrant + embeddings are configured, dense scores can be fused in.
"""

import math
import re

_TOKEN = re.compile(r"[a-z0-9]{2,}")


def retrieve(query: str, clauses: list[dict], k: int = 5) -> list[dict]:
    query_terms = _TOKEN.findall(query.lower())
    if not query_terms or not clauses:
        return []

    doc_tokens = [_TOKEN.findall((c.get("title", "") + " " + c["text"]).lower()) for c in clauses]
    df = {term: sum(1 for tokens in doc_tokens for _ in [0] if term in tokens) for term in set(query_terms)}
    total = len(clauses)

    scored = []
    for clause, tokens in zip(clauses, doc_tokens):
        counts = {t: tokens.count(t) for t in query_terms}
        score = sum(
            (counts[t] / (len(tokens) + 1)) * math.log((total + 1) / (df.get(t, 0) + 1))
            for t in query_terms
        )
        if query_terms and any(t in clause.get("title", "").lower() for t in query_terms):
            score *= 1.5  # title hit boost
        if score > 0:
            scored.append((score, clause))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [clause for _, clause in scored[:k]]
