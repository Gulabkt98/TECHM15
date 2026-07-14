"""Cross-document contradiction detection — deterministic numeric layer.

Compares normalised values for the same clause type across the governing
MSA and each SOW; a confirmed mismatch is a contradiction claim citing
BOTH quotes, resolved via the Order of Precedence clause when one exists.
"""

from app.constants import DocumentType, RiskCategory
from app.risk_engine.normalize import parse_durations, sentence_containing
from app.risk_engine.payment import _cite
from app.risk_engine.scoring import score

_NUMERIC_TYPES = [("payment", "day"), ("termination", "day"), ("confidentiality", "year")]


def find_cross_document_contradictions(clauses: list[dict], documents_by_id: dict[str, dict]) -> list[dict]:
    claims: list[dict] = []
    msa_clauses = [c for c in clauses if _doc_type(c, documents_by_id) == DocumentType.MSA]
    sow_clauses = [c for c in clauses if _doc_type(c, documents_by_id) == DocumentType.SOW]
    if not msa_clauses or not sow_clauses:
        return claims

    precedence = _precedence_clause(msa_clauses)

    for clause_type, unit in _NUMERIC_TYPES:
        msa_value = _first_value(msa_clauses, clause_type, unit)
        sow_value = _first_value(sow_clauses, clause_type, unit)
        if msa_value and sow_value and msa_value[0] != sow_value[0]:
            msa_clause, msa_days, msa_phrase = msa_value[1], msa_value[0], msa_value[2]
            sow_clause, sow_days, sow_phrase = sow_value[1], sow_value[0], sow_value[2]
            resolution = (
                f"MSA prevails per Order of Precedence clause {precedence['clause_ref']}."
                if precedence
                else "No Order of Precedence clause found — conflict is unresolved and needs negotiation."
            )
            citations = [
                _cite(msa_clause, sentence_containing(msa_clause["text"], msa_phrase)),
                _cite(sow_clause, sentence_containing(sow_clause["text"], sow_phrase)),
            ]
            if precedence:
                citations.append(_cite(precedence, precedence["text"][:200].strip()))
            claims.append(
                {
                    "category": RiskCategory.CONTRADICTION,
                    "severity": score("cross_document_conflict"),
                    "summary": (
                        f"{clause_type.capitalize()} terms contradict across documents: MSA says "
                        f"{msa_days} {unit}(s), SOW says {sow_days} {unit}(s). {resolution}"
                    ),
                    "playbook_rule": "cross_document.consistency",
                    "clause_id": sow_clause["id"],
                    "citations": citations,
                    "extraction_confidence": min(
                        msa_clause["extraction_confidence"], sow_clause["extraction_confidence"]
                    ),
                    "fallback_template": None,
                    "original_snippet": sentence_containing(sow_clause["text"], sow_phrase),
                }
            )
    return claims


def _doc_type(clause: dict, documents_by_id: dict[str, dict]) -> str:
    return documents_by_id.get(clause["document_id"], {}).get("doc_type", "")


def _first_value(clauses: list[dict], clause_type: str, unit: str):
    for clause in clauses:
        if clause["clause_type"] != clause_type:
            continue
        values = parse_durations(clause["text"], unit)
        if values:
            return values[0][0], clause, values[0][1]
    return None


def _precedence_clause(clauses: list[dict]) -> dict | None:
    return next((c for c in clauses if c["clause_type"] == "precedence"), None)
