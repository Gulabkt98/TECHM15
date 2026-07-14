"""PDF parsing — text with layout provenance.

Extracts per-page text with character offsets and bounding boxes
(PyMuPDF), which downstream citation highlighting depends on.
"""


class PdfParser:
    def parse(self, path: str) -> dict:
        """Return {pages: [{number, text, spans: [(char_start, char_end, bbox)]}]}."""
        # TODO(parser): PyMuPDF extraction preserving char offsets per page.
        raise NotImplementedError
