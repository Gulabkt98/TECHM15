"""Report Generation Agent — assembles the reviewer pack.

Bundles verified findings, contradiction matrix, evidence-gap report,
redline appendix, the grounding counter (generated/verified/rejected),
and the audit-chain digest into exportable formats.
"""

from app.agents.state import ReviewState


class ReportAgent:
    name = "report"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(report): app.reports.executive_summary + json_report + pdf;
        # set state["report"].
        raise NotImplementedError("ReportAgent.run")
