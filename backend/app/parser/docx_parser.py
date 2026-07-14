"""DOCX parsing — paragraphs, numbering, and native tables via python-docx."""


class DocxParser:
    def parse(self, path: str) -> dict:
        # TODO(parser): map docx paragraphs/numbering into the same page/offset
        # model PdfParser produces, so downstream code is format-agnostic.
        raise NotImplementedError
