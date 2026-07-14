"""Risk Detection Agent — playbook evaluation over evaluable clauses.

Runs the deterministic category checkers in app.risk_engine.* and asks
the LLM only for gaps the rules cannot decide. Emits raw claims; nothing
it produces is shown until the Citation Agent's grounding gate verifies it.
"""

from app.agents.state import ReviewState


class RiskAgent:
    name = "risk"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(risk): iterate app.risk_engine checkers (payment, sla,
        # liability, ip, confidentiality, termination) → scoring.score()
        # → append to state["raw_claims"].
        raise NotImplementedError("RiskAgent.run: wire app.risk_engine")
