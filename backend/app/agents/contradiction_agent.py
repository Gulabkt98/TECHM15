"""Contradiction Agent — cross-document conflict detection.

Pairs comparable clauses across MSA / SOW / amendments (via clause type
and defined-term links), asks the LLM for contradiction candidates, then
re-verifies numeric conflicts deterministically (days, amounts, %) and
resolves winners via the Order of Precedence clause.
"""

from app.agents.state import ReviewState


class ContradictionAgent:
    name = "contradiction"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(contradiction): app.compare.msa_vs_sow + clause_compare →
        # normalize numbers → precedence resolution → state["raw_claims"].
        raise NotImplementedError("ContradictionAgent.run")
