"""Payment-terms checker.

Normalises payment durations and compares against the playbook maximum.
Every claim quotes the exact sentence it was derived from.
"""

from app.constants import RiskCategory
from app.risk_engine.normalize import parse_durations, sentence_containing
from app.risk_engine.scoring import score


def check_payment_terms(clauses: list[dict], playbook: dict) -> list[dict]:
    rules = playbook["rules"].get("payment", {})
    max_days = rules.get("max_payment_days", 45)
    claims = []
    for clause in clauses:
        if clause["clause_type"] != "payment":
            continue
        for days, phrase in parse_durations(clause["text"], "day"):
            if days > max_days:
                claims.append(
                    {
                        "category": RiskCategory.PAYMENT,
                        "severity": score("limit_breach"),
                        "summary": f"Payment terms of {days} days exceed the playbook maximum of {max_days} days.",
                        "playbook_rule": f"payment.max_payment_days={max_days}",
                        "clause_id": clause["id"],
                        "citations": [_cite(clause, sentence_containing(clause["text"], phrase))],
                        "extraction_confidence": clause["extraction_confidence"],
                        "fallback_template": rules.get("fallback_template"),
                        "original_snippet": sentence_containing(clause["text"], phrase),
                    }
                )
                break  # one claim per clause
    return claims


def _cite(clause: dict, quote: str) -> dict:
    return {
        "document": clause.get("document_ref", ""),
        "clause_ref": clause["clause_ref"],
        "page": clause["page"],
        "quote": quote,
        "verified": False,
    }
