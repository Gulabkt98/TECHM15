"""Lexical similarity for clause pairing (embedding-free, deterministic)."""

import re

_TOKEN = re.compile(r"[a-z]{3,}")


def tokenize(text: str) -> set[str]:
    return set(_TOKEN.findall(text.lower()))


def jaccard(text_a: str, text_b: str) -> float:
    a, b = tokenize(text_a), tokenize(text_b)
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def most_similar(query_text: str, candidates: list[dict], top_k: int = 3) -> list[dict]:
    scored = sorted(candidates, key=lambda c: jaccard(query_text, c["text"]), reverse=True)
    return scored[:top_k]
