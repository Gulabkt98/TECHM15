"""Domain vocabulary shared across the platform.

Single source of truth for enums — API schemas, agents, the risk engine,
and the graph layer all import from here so the vocabulary never drifts.
"""

from enum import StrEnum


class DocumentType(StrEnum):
    MSA = "msa"
    SOW = "sow"
    NDA = "nda"
    AMENDMENT = "amendment"
    EXHIBIT = "exhibit"


class DocumentStatus(StrEnum):
    UPLOADED = "uploaded"
    PARSED = "parsed"
    GATED = "gated"          # completeness gate ran; may have evidence gaps
    ANALYZED = "analyzed"


class EdgeType(StrEnum):
    """Typed edges of the clause dependency graph (Neo4j)."""

    REFERENCES = "REFERENCES"
    OVERRIDES = "OVERRIDES"            # "Notwithstanding Section X"
    SUBORDINATE_TO = "SUBORDINATE_TO"  # "Subject to Section X"
    CONDITIONS_ON = "CONDITIONS_ON"
    INCORPORATES = "INCORPORATES"      # external doc dependency → refusal gate
    CONTRADICTS = "CONTRADICTS"
    GOVERNS = "GOVERNS"
    AMENDS = "AMENDS"
    DEFINES = "DEFINES"
    USES_TERM = "USES_TERM"


class Severity(StrEnum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class FindingStatus(StrEnum):
    OPEN = "open"
    ACCEPTED = "accepted"
    MODIFIED = "modified"
    REJECTED = "rejected"


class ClauseEvaluability(StrEnum):
    EVALUABLE = "evaluable"
    UNEVALUABLE = "unevaluable"  # blocked by a missing external document


class RiskCategory(StrEnum):
    PAYMENT = "payment"
    SLA = "sla"
    CONFIDENTIALITY = "confidentiality"
    IP = "ip"
    LIABILITY = "liability"
    TERMINATION = "termination"
    CONTRADICTION = "contradiction"
