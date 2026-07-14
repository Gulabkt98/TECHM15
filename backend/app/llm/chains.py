"""Composed LLM call sequences with deterministic fallbacks.

Pattern everywhere: try Gemini for nuance, fall back to keyword rules —
and either way the output goes through the grounding gate before use.
"""

from app.llm import gemini
from app.llm.output_parser import parse_claims
from app.llm.prompts import CLASSIFY_CLAUSE
from app.parser.clause_extractor import classify_clause

_CATEGORIES = "payment, liability, sla, indemnity, confidentiality, ip, termination, definitions, governing_law, precedence, other"


async def classify(clause: dict) -> str:
    """LLM classification when available; keyword classifier otherwise."""
    result = await gemini.generate_json(
        CLASSIFY_CLAUSE.format(clause_text=clause["text"][:4000], categories=_CATEGORIES)
    )
    if result and result.get("category"):
        return str(result["category"]).lower()
    return classify_clause(clause.get("title", ""), clause["text"])


async def grounded_answer(question: str, context_clauses: list[dict]) -> dict | None:
    """LLM answer over retrieved clauses; claims validated by output_parser.
    Returns None when the LLM is unavailable — callers fall back to quoting
    the retrieved evidence directly."""
    context = "\n\n".join(
        f"[{c['clause_ref']}] (page {c['page']})\n{c['text'][:1500]}" for c in context_clauses
    )
    prompt = (
        "You are a contract analyst. Answer the question using ONLY the clauses below. "
        'Respond as JSON: {"answer": str, "claims": [{"summary": str, "quote": str, "clause_ref": str}]}. '
        "Every claim quote must be verbatim from a clause. If the clauses cannot answer, "
        'return {"answer": "insufficient evidence", "claims": []}.\n\n'
        f"Question: {question}\n\nClauses:\n{context}"
    )
    result = await gemini.generate_json(prompt)
    if result is None:
        return None
    well_formed, _dropped = parse_claims(result)
    return {"answer": result.get("answer", ""), "claims": well_formed}
