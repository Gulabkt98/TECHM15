"""Clause registry construction from parsed sections.

Every numbered section becomes a clause with a stable ref (MSA-9.2),
full provenance, a deterministic keyword classification, typed
cross-reference edges (the raw material for the dependency graph), and
external document mentions ("Exhibit B") for the completeness gate.
"""

import re

from app.constants import EdgeType

# Edge triggers — order matters: specific override language wins over plain references.
_OVERRIDES = re.compile(r"[Nn]otwithstanding[^.\n]{0,60}?[Ss]ection\s+(\d+(?:\.\d+)*)")
_SUBORDINATE = re.compile(r"[Ss]ubject\s+to[^.\n]{0,60}?[Ss]ection\s+(\d+(?:\.\d+)*)")
_CONDITIONS = re.compile(r"[Ii]f[^.\n]{0,100}?under\s+[Ss]ection\s+(\d+(?:\.\d+)*)")
_REFERENCE = re.compile(r"[Ss]ection\s+(\d+(?:\.\d+)*)")
_EXTERNAL = re.compile(r"\b(Exhibit|Schedule|Annex|Appendix|Attachment)\s+([A-Z0-9]{1,3})\b")

_TYPE_KEYWORDS: list[tuple[str, list[str]]] = [
    ("precedence", ["order of precedence", "in the event of any conflict", "shall prevail"]),
    ("payment", ["payment", "invoice", "fees", "net 30", "net 60", "net 45", "payable"]),
    ("liability", ["limitation of liability", "liability", "liable", "aggregate liability", "damages cap"]),
    ("sla", ["service level", "sla", "service credit", "uptime", "availability", "penalt"]),
    ("indemnity", ["indemnif", "hold harmless", "defend"]),
    ("confidentiality", ["confidential", "non-disclosure", "nondisclosure"]),
    ("ip", ["intellectual property", "work product", "ownership of deliverables", "license", "copyright"]),
    ("termination", ["terminat", "notice period", "wind-down"]),
    ("definitions", ["definitions", '"means"', "shall mean"]),
    ("governing_law", ["governing law", "jurisdiction", "venue"]),
]


def classify_clause(title: str, text: str) -> str:
    haystack = f"{title}\n{text}".lower()
    best, best_hits = "other", 0
    for clause_type, keywords in _TYPE_KEYWORDS:
        hits = sum(haystack.count(k) for k in keywords)
        if hits > best_hits:
            best, best_hits = clause_type, hits
    return best


def extract_clauses(sections: list[dict], doc_ref: str, full_text: str) -> list[dict]:
    clauses = []
    for section in sections:
        text = full_text[section["char_start"]:section["char_end"]].strip()
        if not text:
            continue
        edges, external = _extract_edges(text, section["ref"])
        clauses.append(
            {
                "clause_ref": f"{doc_ref}-{section['ref']}",
                "section_ref": section["ref"],
                "section_path": _section_path(section, sections),
                "title": section["title"],
                "text": text,
                "page": section["page"],
                "char_start": section["char_start"],
                "char_end": section["char_end"],
                "clause_type": classify_clause(section["title"], text),
                "extraction_confidence": section["confidence"],
                "edges": edges,          # [{target_section_ref, edge_type, trigger_text}]
                "external_refs": external,
            }
        )
    return clauses


def _extract_edges(text: str, own_ref: str) -> tuple[list[dict], list[str]]:
    edges: list[dict] = []
    claimed_targets: set[str] = set()

    for pattern, edge_type in (
        (_OVERRIDES, EdgeType.OVERRIDES),
        (_SUBORDINATE, EdgeType.SUBORDINATE_TO),
        (_CONDITIONS, EdgeType.CONDITIONS_ON),
    ):
        for match in pattern.finditer(text):
            target = match.group(1)
            if target != own_ref:
                edges.append({"target_section_ref": target, "edge_type": edge_type, "trigger_text": match.group(0)})
                claimed_targets.add((edge_type, target))

    typed = {t for _, t in claimed_targets}
    for match in _REFERENCE.finditer(text):
        target = match.group(1)
        if target != own_ref and target not in typed:
            edges.append({"target_section_ref": target, "edge_type": EdgeType.REFERENCES, "trigger_text": match.group(0)})
            typed.add(target)

    external = sorted({f"{m.group(1)} {m.group(2)}" for m in _EXTERNAL.finditer(text)})
    return edges, external


def _section_path(section: dict, sections: list[dict]) -> list[str]:
    """Ancestor titles derived from ref prefixes: 9.2 → ["9 Liability", "9.2 Cap"]."""
    titles = {s["ref"]: s["title"] for s in sections}
    parts = section["ref"].split(".")
    path = []
    for depth in range(1, len(parts) + 1):
        ref = ".".join(parts[:depth])
        if ref in titles:
            path.append(f"{ref} {titles[ref]}".strip())
    return path
