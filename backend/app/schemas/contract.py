"""Contract family and document I/O contracts."""

from datetime import datetime

from pydantic import BaseModel

from app.constants import DocumentStatus, DocumentType


class DocumentOut(BaseModel):
    id: str
    filename: str
    doc_type: DocumentType
    status: DocumentStatus
    uploaded_at: datetime


class EvidenceGap(BaseModel):
    """One missing external document and the clauses it blocks."""

    missing_document: str
    referenced_from: list[str]        # clause refs containing the INCORPORATES edge
    blocked_clause_ids: list[str]     # transitive blast radius
    resolved: bool = False


class ContractFamilyOut(BaseModel):
    id: str
    name: str
    documents: list[DocumentOut]
    evidence_gaps: list[EvidenceGap]
