"""Grounded Q&A over a contract family.

Unlike a generic chatbot, answers are produced by the chat workflow:
graph-scoped retrieval → LLM with mandatory quotes → grounding verifier.
Unverifiable answers are refused, not invented.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.response import not_implemented

router = APIRouter()


class ChatRequest(BaseModel):
    contract_id: str
    question: str


@router.post("")
async def ask(payload: ChatRequest) -> dict:
    raise not_implemented("Grounded contract Q&A")
