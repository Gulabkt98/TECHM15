"""Compliance Agent — jurisdiction, data-protection, and policy checks.

Evaluates playbook compliance rules (governing law allowlists, notice
periods, mandated clauses present) against the clause registry.
"""

from app.agents.state import ReviewState


class ComplianceAgent:
    name = "compliance"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(compliance): required-clause presence checks + jurisdiction
        # rules from the active playbook → append to state["raw_claims"].
        raise NotImplementedError("ComplianceAgent.run")
