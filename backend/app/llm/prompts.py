"""Analysis prompt templates.

Every template embeds the grounding contract (app.rag.prompts.GROUNDING_RULES):
verbatim quotes + clause refs are mandatory, refusal beats speculation.
"""

from app.rag.prompts import GROUNDING_RULES

CLASSIFY_CLAUSE = (
    "You are a contract analyst. Classify the clause into one of the given "
    "categories and extract obligations (party, action, deadline, trigger).\n"
    f"{GROUNDING_RULES}\n\nClause:\n{{clause_text}}\n\nCategories:\n{{categories}}"
)

CONTRADICTION_CHECK = (
    "Compare the two clauses below from related contract documents. State "
    "whether they are consistent, contradictory, or undecidable without a "
    "missing document.\n"
    f"{GROUNDING_RULES}\n\nClause A ({{ref_a}}):\n{{text_a}}\n\nClause B ({{ref_b}}):\n{{text_b}}"
)
