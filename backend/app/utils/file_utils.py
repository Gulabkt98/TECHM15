"""Filesystem persistence for uploaded and processed artifacts.

Kept behind small functions so swapping local disk for S3 later only
touches this module.
"""

from pathlib import Path

from app.config import get_settings
from app.utils.helpers import new_id


def save_upload(filename: str, content: bytes) -> Path:
    settings = get_settings()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(filename).suffix.lower()
    target = settings.upload_dir / f"{new_id()}{suffix}"
    target.write_bytes(content)
    return target
