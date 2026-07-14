"""Confidentiality checker: survival period vs playbook minimum."""

from app.constants import RiskCategory
from app.risk_engine.normalize import parse_durations, sentence_containing
from app.risk_engine.payment import _cite
from app.risk_engine.scoring import score


def check_confidentiality(clauses: list[dict], playbook: dict) -> list[dict]:
    rules = playbook["rules"].get("confidentiality", {})
    min_years = rules.get("min_survival_years", 2)
    claims = []
    for clause in clauses:
        if clause["clause_type"] != "confidentiality":
            continue
        for years, phrase in parse_durations(clause["text"], "year"):
            if years < min_years:
                claims.append(
                    {
                        "category": RiskCategory.CONFIDENTIALITY,
                        "severity": score("soft_breach"),
                        "summary": f"Confidentiality survival of {years} year(s) is below the playbook minimum of {min_years} years.",
                        "playbook_rule": f"confidentiality.min_survival_years={min_years}",
                        "clause_id": clause["id"],
                        "citations": [_cite(clause, sentence_containing(clause["text"], phrase))],
                        "extraction_confidence": clause["extraction_confidence"],
                        "fallback_template": rules.get("fallback_template"),
                        "original_snippet": sentence_containing(clause["text"], phrase),
                    }
                )
                break
    return claims
