"""Structure-preserving table extraction.

Tables (penalties, fees, milestones, SLAs) are kept as
{headers, rows, units} JSON — never flattened to prose — so the risk
engine can cross-validate them against clause text.
"""


def extract_tables(path: str) -> list[dict]:
    # TODO(parser): pdfplumber table detection + header inference.
    raise NotImplementedError
