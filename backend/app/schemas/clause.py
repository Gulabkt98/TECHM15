"""Clause registry I/O contracts.

Provenance (page + char offsets) is mandatory — it is what makes every
citation machine-verifiable by the grounding gate.
"""

from pydantic import BaseModel, Field

from app.constants import ClauseEvaluability, EdgeType


class Provenance(BaseModel):
    document_id: str
    page: int
    char_start: int
    char_end: int


class ClauseOut(BaseModel):
    id: str
    clause_ref: str                   # e.g. "MSA-9.2.1"
    section_path: list[str]           # ["9 Liability", "9.2 Cap"]
    text: str
    clause_type: str | None = None    # CUAD-style category
    extraction_confidence: float = Field(ge=0.0, le=1.0)
    evaluability: ClauseEvaluability = ClauseEvaluability.EVALUABLE
    provenance: Provenance


class ClauseEdge(BaseModel):
    source_clause_id: str
    target_clause_id: str
    edge_type: EdgeType
    trigger_text: str                 # e.g. "Notwithstanding Section 9.2"


class TableOut(BaseModel):
    id: str
    clause_id: str
    headers: list[str]
    rows: list[list[str]]
    page: int
