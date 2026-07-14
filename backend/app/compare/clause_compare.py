"""Pairwise clause comparison primitives shared by all comparison flows."""


def compare_clauses(clause_a: dict, clause_b: dict) -> dict:
    """Return {verdict: consistent|contradiction|needs_missing_doc, detail}."""
    # TODO(compare): semantic + normalised-numeric comparison with quotes.
    raise NotImplementedError
