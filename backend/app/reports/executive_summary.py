"""Executive summary assembly — the first page of the reviewer pack.

Includes the honesty metrics: claims generated / verified / rejected,
and the evidence-gap list, shown as prominently as the risks themselves.
"""


def build_summary(findings: list[dict], gaps: list[dict], counters: dict) -> dict:
    # TODO(reports): severity rollup + top risks + gap statement.
    raise NotImplementedError
