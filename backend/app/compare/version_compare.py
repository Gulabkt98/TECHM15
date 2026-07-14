"""Version-to-version diff of the same document (amendment review)."""

from diff_match_patch import diff_match_patch


def compare_versions(clauses_a: list[dict], clauses_b: list[dict]) -> list[dict]:
    """Align clauses by section_ref and word-diff each changed pair."""
    by_ref_a = {c["section_ref"]: c for c in clauses_a}
    by_ref_b = {c["section_ref"]: c for c in clauses_b}
    dmp = diff_match_patch()
    changes = []
    for ref in sorted(set(by_ref_a) | set(by_ref_b)):
        old = by_ref_a.get(ref, {}).get("text", "")
        new = by_ref_b.get(ref, {}).get("text", "")
        if old == new:
            continue
        diffs = dmp.diff_main(old, new)
        dmp.diff_cleanupSemantic(diffs)
        changes.append(
            {
                "section_ref": ref,
                "status": "added" if not old else "removed" if not new else "modified",
                "diff": [{"op": _op(op), "text": text} for op, text in diffs],
            }
        )
    return changes


def _op(op: int) -> str:
    return {0: "equal", 1: "insert", -1: "delete"}[op]
