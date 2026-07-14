"""Report exports — reviewer pack, executive summary, machine-readable JSON."""

from fastapi import APIRouter

from app.utils.response import not_implemented

router = APIRouter()


@router.get("/{contract_id}/pdf")
async def pdf_report(contract_id: str) -> dict:
    raise not_implemented("PDF report export")


@router.get("/{contract_id}/json")
async def json_report(contract_id: str) -> dict:
    raise not_implemented("JSON report export")


@router.get("/{contract_id}/audit")
async def audit_trail(contract_id: str) -> dict:
    """Hash-chained audit ledger for one contract family."""
    raise not_implemented("Audit trail export")
