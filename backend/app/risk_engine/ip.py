"""Intellectual-property checker (customer-perspective playbook).

Flags language vesting deliverable ownership in the supplier when the
playbook requires customer ownership.
"""

import re

from app.constants import RiskCategory
from app.risk_engine.normalize import sentence_containing
from app.risk_engine.payment import _cite
from app.risk_engine.scoring import score

_SUPPLIER_OWNS = re.compile(
    r"(Supplier|Vendor|Provider|Contractor)\s+(?:shall\s+)?(?:retain|retains|own|owns)[^.\n]{0,80}"
    r"(right|title|interest|intellectual property|work product|deliverable)",
    re.IGNORECASE,
)


def check_ip(clauses: list[dict], playbook: dict) -> list[dict]:
    rules = playbook["rules"].get("ip", {})
    if not rules.get("customer_owns_deliverables", True):
        return []
    claims = []
    for clause in clauses:
        if clause["clause_type"] != "ip":
            continue
        match = _SUPPLIER_OWNS.search(clause["text"])
        if match and "pre-existing" not in sentence_containing(clause["text"], match.group(0)).lower():
            sentence = sentence_containing(clause["text"], match.group(0))
            claims.append(
                {
                    "category": RiskCategory.IP,
                    "severity": score("limit_breach"),
                    "summary": "Deliverable IP appears to vest in the supplier; playbook requires customer ownership.",
                    "playbook_rule": "ip.customer_owns_deliverables",
                    "clause_id": clause["id"],
                    "citations": [_cite(clause, sentence)],
                    "extraction_confidence": clause["extraction_confidence"],
                    "fallback_template": rules.get("fallback_template"),
                    "original_snippet": sentence,
                }
            )
    return claims
