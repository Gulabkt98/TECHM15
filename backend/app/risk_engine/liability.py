"""Limitation-of-liability checker.

Evaluates the EFFECTIVE cap (after override-chain resolution — a
"Notwithstanding" carve-out changes the answer) against playbook tiers.
"""


def check_liability(clauses: list[dict], playbook: dict) -> list[dict]:
    # TODO(risk): cap multiple extraction, carve-out enumeration,
    # uncapped-liability walk-away detection.
    raise NotImplementedError
