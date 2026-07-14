"""Shared LangGraph state for the review pipeline.

Every agent receives and returns ReviewState. Keeping it a single typed
structure makes agent I/O contracts explicit and the pipeline auditable:
the state at each step can be snapshotted into the audit ledger.
"""

from typing import Any, TypedDict


class ReviewState(TypedDict, total=False):
    contract_family_id: str

    # Stage outputs (populated as the pipeline advances)
    parsed_documents: list[dict[str, Any]]     # clause registry + tables per doc
    graph_summary: dict[str, Any]              # node/edge counts, cycle report
    evidence_gaps: list[dict[str, Any]]        # completeness-gate output
    retrieved_context: list[dict[str, Any]]    # graph-scoped RAG context packs
    raw_claims: list[dict[str, Any]]           # LLM outputs BEFORE grounding check
    verified_findings: list[dict[str, Any]]    # claims that passed the gate
    rejected_claims: list[dict[str, Any]]      # claims that failed — logged, never shown
    redlines: list[dict[str, Any]]
    report: dict[str, Any]

    # Control
    errors: list[str]
