"""OCR fallback for scanned contracts.

Only invoked when a page yields no extractable text. OCR output carries
lower extraction confidence, which routes clauses to human verification.
"""


def ocr_page(image_bytes: bytes) -> str:
    # TODO(parser): Tesseract (or cloud OCR) with confidence capture.
    raise NotImplementedError
