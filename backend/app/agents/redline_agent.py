"""Redline Suggestion Agent — word-level fallback-language edits.

For each verified finding whose playbook verdict is fallback-needed,
instantiates the playbook's fallback template with this contract's
parameters and produces a word-level diff against the original clause.
"""

from app.agents.state import ReviewState


class RedlineAgent:
    name = "redline"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(redline): diff-match-patch word diff original ↔ fallback;
        # store insert/delete ops in state["redlines"] for UI rendering
        # and OOXML tracked-changes export.
        raise NotImplementedError("RedlineAgent.run")
