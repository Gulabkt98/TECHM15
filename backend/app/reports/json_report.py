"""Machine-readable report export (schemas.report.FullReport)."""

from app.schemas.report import FullReport


def build_json_report(report: dict) -> FullReport:
    # TODO(reports): validate + serialise via FullReport.
    raise NotImplementedError
