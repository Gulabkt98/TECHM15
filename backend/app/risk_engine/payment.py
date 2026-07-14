"""Payment-terms checker.

Normalises durations ("thirty (30) days", "Net 60") to canonical days
and compares against playbook limits and the governing MSA's terms.
"""


def check_payment_terms(clauses: list[dict], playbook: dict) -> list[dict]:
    # TODO(risk): duration normalisation + max_payment_days guard +
    # MSA↔SOW consistency candidate generation.
    raise NotImplementedError
