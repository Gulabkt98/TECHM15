"""Hash-chained audit ledger.

Each event embeds the SHA-256 of the previous event's hash + its own
payload, making the trail tamper-evident. Every pipeline stage and every
human decision appends here.
"""

import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import AuditEvent
from app.utils.helpers import chain_hash

GENESIS = "0" * 64


async def append_audit(session: AsyncSession, family_id: str, event_type: str, payload: dict) -> AuditEvent:
    last = await session.scalar(
        select(AuditEvent)
        .where(AuditEvent.family_id == family_id)
        .order_by(AuditEvent.created_at.desc(), AuditEvent.id.desc())
        .limit(1)
    )
    prev_hash = last.event_hash if last else GENESIS
    event_hash = chain_hash(prev_hash, event_type + json.dumps(payload, sort_keys=True, default=str))
    event = AuditEvent(
        family_id=family_id, event_type=event_type, payload=payload,
        prev_hash=prev_hash, event_hash=event_hash,
    )
    session.add(event)
    return event


async def verify_chain(session: AsyncSession, family_id: str) -> bool:
    events = (
        await session.scalars(
            select(AuditEvent)
            .where(AuditEvent.family_id == family_id)
            .order_by(AuditEvent.created_at, AuditEvent.id)
        )
    ).all()
    prev = GENESIS
    for e in events:
        if e.prev_hash != prev:
            return False
        expected = chain_hash(prev, e.event_type + json.dumps(e.payload, sort_keys=True, default=str))
        if e.event_hash != expected:
            return False
        prev = e.event_hash
    return True
