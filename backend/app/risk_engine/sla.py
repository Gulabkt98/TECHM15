"""SLA / service-credit checker.

Reads penalty TABLES as structured data and cross-validates against
prose caps — e.g. an SLA credit table that can exceed the liability cap.
"""


def check_sla(clauses: list[dict], tables: list[dict], playbook: dict) -> list[dict]:
    # TODO(risk): accumulate max table penalties; compare with cap clauses.
    raise NotImplementedError
