"""Section-tree recovery from raw page text.

Deterministic heuristics for the common legal numbering schemes:
decimal (1., 1.1, 1.1.1), alpha ((a), (b)), roman ((i), (ii)).
Unrecognised regions are flagged honestly, never guessed.
"""


def build_section_tree(pages: list[dict]) -> list[dict]:
    """Return nested sections: {ref, title, char_start, char_end, children}."""
    # TODO(parser): regex-driven scheme detection + indentation heuristics.
    raise NotImplementedError
