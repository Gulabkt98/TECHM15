"""Cross-document comparison — MSA vs SOW alignment, version diffs."""

from fastapi import APIRouter

from app.utils.response import not_implemented

router = APIRouter()


@router.post("/msa-vs-sow")
async def msa_vs_sow(msa_id: str, sow_id: str) -> dict:
    """Contradiction matrix between a governing MSA and a child SOW."""
    raise not_implemented("MSA vs SOW comparison")


@router.post("/versions")
async def versions(doc_id_a: str, doc_id_b: str) -> dict:
    raise not_implemented("Version comparison")
