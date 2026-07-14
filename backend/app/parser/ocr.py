"""OCR fallback for scanned contracts.

Optional capability: uses pytesseract when installed; otherwise returns
empty text so the caller flags the page as low-extraction-confidence and
routes it to human verification instead of guessing.
"""

from app.utils.logger import get_logger

logger = get_logger(__name__)


def ocr_page(image_bytes: bytes) -> str:
    try:
        import io

        import pytesseract
        from PIL import Image

        return pytesseract.image_to_string(Image.open(io.BytesIO(image_bytes)))
    except ImportError:
        logger.warning("pytesseract not installed — scanned page left unextracted (honest low confidence)")
        return ""
