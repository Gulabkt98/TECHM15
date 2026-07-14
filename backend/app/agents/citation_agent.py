"""Citation Agent — the zero-hallucination grounding gate.

Every raw claim must quote its evidence with char offsets. This agent
string-matches each quote against the source document at those offsets:
  match   → claim promoted to state["verified_findings"]
  no match → claim moved to state["rejected_claims"] and audit-logged.
No unverified claim ever reaches a reviewer. This is deterministic code,
not an LLM judgment — by design.
"""

from app.agents.state import ReviewState


class CitationAgent:
    name = "citation"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(citation): for each claim in state["raw_claims"], load the
        # source span (document_id, char_start, char_end) and compare with
        # the quoted text after whitespace normalisation.
        raise NotImplementedError("CitationAgent.run: grounding gate")
