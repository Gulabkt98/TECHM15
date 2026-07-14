"""SLA / service-credit checker — table-vs-prose cross-validation.

Reads penalty TABLES as structured data; if the maximum credit in a table
exceeds the aggregate cap stated in prose (or the playbook limit), that
is a flagged conflict citing both the table and the prose sentence.
"""

import re

from app.constants import RiskCategory
from app.risk_engine.normalize import parse_percents, sentence_containing
from app.risk_engine.payment import _cite
from app.risk_engine.scoring import score

_CAP_CONTEXT = re.compile(r"(credit|penalt|aggregate|exceed|cap)", re.IGNORECASE)


def check_sla(clauses: list[dict], tables: list[dict], playbook: dict) -> list[dict]:
    rules = playbook["rules"].get("sla", {})
    playbook_max = rules.get("max_total_credits_pct", 10.0)
    claims: list[dict] = []

    table_max, table_evidence = _max_table_percent(tables)
    prose_cap, prose_clause, prose_quote = _prose_cap(clauses)

    if table_max is None:
        return claims

    if prose_cap is not None and table_max > prose_cap:
        claims.append(
            {
                "category": RiskCategory.SLA,
                "severity": score("table_prose_conflict"),
                "summary": (
                    f"SLA credit table allows up to {table_max:g}% but the prose caps credits at "
                    f"{prose_cap:g}% — the table silently breaches the cap."
                ),
                "playbook_rule": "sla.table_vs_prose_consistency",
                "clause_id": prose_clause["id"] if prose_clause else None,
                "citations": (
                    [_cite(prose_clause, prose_quote)] if prose_clause else []
                ) + [_table_cite(table_evidence)],
                "extraction_confidence": prose_clause["extraction_confidence"] if prose_clause else 0.9,
                "fallback_template": rules.get("fallback_template"),
                "original_snippet": prose_quote or "",
            }
        )
    elif table_max > playbook_max:
        claims.append(
            {
                "category": RiskCategory.SLA,
                "severity": score("limit_breach"),
                "summary": f"SLA credits can reach {table_max:g}%, above the playbook maximum of {playbook_max:g}%.",
                "playbook_rule": f"sla.max_total_credits_pct={playbook_max:g}",
                "clause_id": None,
                "citations": [_table_cite(table_evidence)],
                "extraction_confidence": 0.9,
                "fallback_template": rules.get("fallback_template"),
                "original_snippet": "",
            }
        )
    return claims


def _max_table_percent(tables: list[dict]) -> tuple[float | None, dict | None]:
    best, evidence = None, None
    for table in tables:
        for row in table.get("rows", []):
            for cell in row:
                for value, _ in parse_percents(str(cell)):
                    if best is None or value > best:
                        best, evidence = value, {"table": table, "row": row}
    return best, evidence


def _prose_cap(clauses: list[dict]) -> tuple[float | None, dict | None, str | None]:
    for clause in clauses:
        if clause["clause_type"] not in ("sla", "liability"):
            continue
        for value, phrase in parse_percents(clause["text"]):
            sentence = sentence_containing(clause["text"], phrase)
            if _CAP_CONTEXT.search(sentence):
                return value, clause, sentence
    return None, None, None


def _table_cite(evidence: dict | None) -> dict:
    if not evidence:
        return {"document": "", "clause_ref": "table", "page": 0, "quote": "", "verified": False}
    return {
        "document": "",
        "clause_ref": f"table@p{evidence['table'].get('page', 0)}",
        "page": evidence["table"].get("page", 0),
        "quote": " | ".join(str(c) for c in evidence["row"]),
        "verified": True,  # structured data quoted directly from the extracted table
    }
