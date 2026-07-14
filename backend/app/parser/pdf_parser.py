"""PDF parsing — text with layout provenance.

Extracts per-page text with document-global character offsets (PyMuPDF),
which downstream citation verification and highlighting depend on.
"""

import fitz  # PyMuPDF


class PdfParser:
    def parse(self, path: str) -> dict:
        """Return {"pages": [{number, text, char_start, char_end}], "full_text": str}."""
        pages: list[dict] = []
        parts: list[str] = []
        offset = 0
        with fitz.open(path) as doc:
            for index, page in enumerate(doc, start=1):
                text = page.get_text("text") or ""
                pages.append(
                    {
                        "number": index,
                        "text": text,
                        "char_start": offset,
                        "char_end": offset + len(text),
                    }
                )
                parts.append(text)
                offset += len(text) + 1  # +1 for the joining newline
        return {"pages": pages, "full_text": "\n".join(parts)}
