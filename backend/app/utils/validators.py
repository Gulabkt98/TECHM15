"""Input validation helpers used by upload and parsing layers."""

from pathlib import Path

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_UPLOAD_MB = 50


def is_allowed_file(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def is_within_size_limit(size_bytes: int) -> bool:
    return size_bytes <= MAX_UPLOAD_MB * 1024 * 1024
