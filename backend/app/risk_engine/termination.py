"""Termination checker: notice periods and one-sided convenience rights."""

import re

from app.constants import RiskCategory
from app.risk_engine.normalize import parse_durations, sentence_containing
from app.risk_engine.payment import _cite
from app.risk_engine.scoring import score

_ONE_SIDED = re.compile(
    r"(?<![Ee]ither\s[Pp]arty\s)(Customer|Supplier|Vendor|Provider)\s+may\s+terminate[^.\n]{0,80}convenience",
    re.IGNORECASE,
)


def check_termination(clauses: list[dict], playbook: dict) -> list[dict]:
    rules = playbook["rules"].get("termination", {})
    min_notice = rules.get("min_notice_days", 30)
    claims = []
    for clause in clauses:
        if clause["clause_type"] != "termination":
            continue

        for days, phrase in parse_durations(clause["text"], "day"):
            sentence = sentence_containing(clause["text"], phrase)
            if "notice" in sentence.lower() and days < min_notice:
                claims.append(
                    {
                        "category": RiskCategory.TERMINATION,
                        "severity": score("soft_breach"),
                        "summary": f"Termination notice of {days} days is below the playbook minimum of {min_notice} days.",
                        "playbook_rule": f"termination.min_notice_days={min_notice}",
                        "clause_id": clause["id"],
                        "citations": [_cite(clause, sentence)],
                        "extraction_confidence": clause["extraction_confidence"],
                        "fallback_template": rules.get("fallback_template"),
                        "original_snippet": sentence,
                    }
                )
                break

        one_sided = _ONE_SIDED.search(clause["text"])
        if one_sided and "either party" not in clause["text"].lower():
            sentence = sentence_containing(clause["text"], one_sided.group(0))
            claims.append(
                {
                    "category": RiskCategory.TERMINATION,
                    "severity": score("limit_breach"),
                    "summary": f"Termination for convenience appears one-sided ({one_sided.group(1)} only).",
                    "playbook_rule": "termination.convenience_must_be_mutual",
                    "clause_id": clause["id"],
                    "citations": [_cite(clause, sentence)],
                    "extraction_confidence": clause["extraction_confidence"],
                    "fallback_template": rules.get("fallback_template"),
                    "original_snippet": sentence,
                }
            )
    return claims
