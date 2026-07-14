"""Report export I/O contracts."""

from datetime import datetime

from pydantic import BaseModel

from app.schemas.contract import EvidenceGap
from app.schemas.risk import FindingOut


class ReportSummary(BaseModel):
    contract_family_id: str
    generated_at: datetime
    findings_total: int
    findings_by_severity: dict[str, int]
    claims_generated: int
    claims_verified: int
    claims_rejected: int              # grounding-gate rejections, shown honestly


class FullReport(BaseModel):
    summary: ReportSummary
    findings: list[FindingOut]
    evidence_gaps: list[EvidenceGap]
    audit_chain_digest: str
