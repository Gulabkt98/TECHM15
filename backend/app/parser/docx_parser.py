"""DOCX parsing — paragraphs and native tables via python-docx.

DOCX has no fixed pages; the whole document is modelled as page 1 with
the same char-offset contract PdfParser produces, so downstream code is
format-agnostic.
"""

from docx import Document as DocxDocument


class DocxParser:
    def parse(self, path: str) -> dict:
        doc = DocxDocument(path)
        text = "\n".join(p.text for p in doc.paragraphs)
        tables = [
            {
                "page": 1,
                "headers": [c.text.strip() for c in t.rows[0].cells] if t.rows else [],
                "rows": [[c.text.strip() for c in r.cells] for r in t.rows[1:]],
            }
            for t in doc.tables
        ]
        return {
            "pages": [{"number": 1, "text": text, "char_start": 0, "char_end": len(text)}],
            "full_text": text,
            "tables": tables,
        }
