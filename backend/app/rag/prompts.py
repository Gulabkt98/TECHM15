"""Retrieval-side prompt fragments (analysis prompts live in app.llm.prompts).

Grounding contract: every prompt built here instructs the model that all
claims MUST carry verbatim quotes with clause refs — output lacking them
is rejected by the Citation Agent regardless of content.
"""

GROUNDING_RULES = (
    "Answer ONLY from the provided clauses. Every claim must include a "
    "verbatim quote and its clause_ref. If the answer depends on a document "
    "that is not provided, say so explicitly instead of guessing."
)
