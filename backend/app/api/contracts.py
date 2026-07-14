"""Contract family and clause read endpoints."""

from fastapi import APIRouter

from app.utils.response import not_implemented

router = APIRouter()


@router.get("")
async def list_contracts() -> dict:
    raise not_implemented("Contract listing")


@router.get("/{contract_id}")
async def get_contract(contract_id: str) -> dict:
    raise not_implemented("Contract detail")


@router.get("/{contract_id}/clauses")
async def list_clauses(contract_id: str) -> dict:
    raise not_implemented("Clause registry")


@router.get("/{contract_id}/gaps")
async def evidence_gaps(contract_id: str) -> dict:
    """Evidence Gap Report: missing external documents + blocked clause IDs."""
    raise not_implemented("Evidence gap report")
