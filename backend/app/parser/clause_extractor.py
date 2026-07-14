"""Clause registry construction from the section tree.

Splits sections into clauses with stable refs (e.g. MSA-9.2.1), then
extracts cross-references, defined terms, obligations, and external
document mentions ("Exhibit B") — the raw material for graph edges.
"""


def extract_clauses(section_tree: list[dict], doc_ref: str) -> list[dict]:
    # TODO(parser): deterministic reference regexes + LLM assist for
    # obligations; every output span carries char offsets.
    raise NotImplementedError
