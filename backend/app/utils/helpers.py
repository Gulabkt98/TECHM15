"""Small, dependency-free helpers shared across modules."""

import hashlib
import uuid


def new_id() -> str:
    return str(uuid.uuid4())


def sha256_hex(payload: bytes | str) -> str:
    data = payload.encode("utf-8") if isinstance(payload, str) else payload
    return hashlib.sha256(data).hexdigest()


def chain_hash(prev_hash: str, payload: str) -> str:
    """Hash-chained audit ledger link: H(prev || payload)."""
    return sha256_hex(prev_hash + payload)
