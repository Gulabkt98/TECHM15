"""Limitation-of-liability checker.

Detects uncapped liability (walk-away) and caps exceeding the playbook
maximum, quoting the exact cap language.
"""

import re

from app.constants import RiskCategory
from app.risk_engine.normalize import parse_durations, sentence_containing
from app.risk_engine.payment import _cite
from app.risk_engine.scoring import score

_UNCAPPED = re.compile(
    r"(liability[^.\n]{0,80}(?:unlimited|not\s+be\s+limited|without\s+limit))|unlimited\s+liability",
    re.IGNORECASE,
)


def check_liability(clauses: list[dict], playbook: dict) -> list[dict]:
    rules = playbook["rules"].get("liability", {})
    max_months = rules.get("max_cap_months", 12)
    claims = []
    for clause in clauses:
        if clause["clause_type"] not in ("liability", "indemnity"):
            continue

        uncapped = _UNCAPPED.search(clause["text"])
        if uncapped and rules.get("uncapped_is_walk_away", True):
            claims.append(
                {
                    "category": RiskCategory.LIABILITY,
                    "severity": score("walk_away"),
                    "summary": "Liability appears uncapped — a walk-away position under the playbook.",
                    "playbook_rule": "liability.uncapped_is_walk_away",
                    "clause_id": clause["id"],
                    "citations": [_cite(clause, sentence_containing(clause["text"], uncapped.group(0)))],
                    "extraction_confidence": clause["extraction_confidence"],
                    "fallback_template": rules.get("fallback_template"),
                    "original_snippet": sentence_containing(clause["text"], uncapped.group(0)),
                }
            )
            continue

        for months, phrase in parse_durations(clause["text"], "month"):
            if months > max_months:
                claims.append(
                    {
                        "category": RiskCategory.LIABILITY,
                        "severity": score("limit_breach"),
                        "summary": f"Liability cap of {months} months of fees exceeds the playbook maximum of {max_months} months.",
                        "playbook_rule": f"liability.max_cap_months={max_months}",
                        "clause_id": clause["id"],
                        "citations": [_cite(clause, sentence_containing(clause["text"], phrase))],
                        "extraction_confidence": clause["extraction_confidence"],
                        "fallback_template": rules.get("fallback_template"),
                        "original_snippet": sentence_containing(clause["text"], phrase),
                    }
                )
                break
    return claims
