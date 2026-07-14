"""Risk finding and reviewer-decision I/O contracts."""

from pydantic import BaseModel, Field

from app.constants import FindingStatus, RiskCategory, Severity


class Citation(BaseModel):
    document: str
    clause_ref: str
    page: int
    quote: str
    verified: bool = False  # set only by the grounding verifier


class FindingOut(BaseModel):
    id: str
    category: RiskCategory
    severity: Severity
    summary: str
    playbook_rule: str
    citations: list[Citation]
    extraction_confidence: float = Field(ge=0.0, le=1.0)
    status: FindingStatus = FindingStatus.OPEN


class ReviewDecision(BaseModel):
    action: FindingStatus              # accepted | modified | rejected
    reason: str | None = None          # mandatory when rejecting (validated in service)
    modified_text: str | None = None   # reviewer-edited redline when modifying
