"""Structure-preserving table extraction for PDFs.

Tables (penalties, fees, milestones, SLAs) are kept as
{page, headers, rows} — never flattened to prose — so the risk engine
can cross-validate them against clause text. DOCX tables come from
DocxParser directly.
"""

import pdfplumber


def extract_tables(path: str) -> list[dict]:
    tables: list[dict] = []
    with pdfplumber.open(path) as pdf:
        for index, page in enumerate(pdf.pages, start=1):
            for raw in page.extract_tables() or []:
                cleaned = [[(cell or "").strip() for cell in row] for row in raw if row]
                if len(cleaned) < 2:
                    continue
                tables.append({"page": index, "headers": cleaned[0], "rows": cleaned[1:]})
    return tables
