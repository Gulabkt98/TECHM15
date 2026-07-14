"""Risk findings and reviewer decisions."""

from fastapi import APIRouter

from app.schemas.risk import ReviewDecision
from app.utils.response import not_implemented

router = APIRouter()


@router.post("/{contract_id}/analyze")
async def analyze(contract_id: str) -> dict:
    """Kick off the full multi-agent review workflow."""
    raise not_implemented("Risk analysis run")


@router.get("/{contract_id}/findings")
async def findings(contract_id: str) -> dict:
    raise not_implemented("Findings listing")


@router.post("/findings/{finding_id}/review")
async def review(finding_id: str, decision: ReviewDecision) -> dict:
    """Human-in-the-loop: accept / modify / reject with audit entry."""
    raise not_implemented("Reviewer decision")
