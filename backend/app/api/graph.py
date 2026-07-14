"""Clause dependency graph endpoints — feeds the React Flow explorer."""

from fastapi import APIRouter

from app.utils.response import not_implemented

router = APIRouter()


@router.get("/{contract_id}")
async def get_graph(contract_id: str) -> dict:
    """Nodes + typed edges of the clause DAG for one contract family."""
    raise not_implemented("Graph export")


@router.get("/{contract_id}/cycles")
async def get_cycles(contract_id: str) -> dict:
    """Circular references (drafting loops) with suggested break points."""
    raise not_implemented("Cycle report")


@router.get("/clause/{clause_id}/effective")
async def effective_clause(clause_id: str) -> dict:
    """Clause text after resolving every OVERRIDES / precedence edge."""
    raise not_implemented("Effective clause resolution")
