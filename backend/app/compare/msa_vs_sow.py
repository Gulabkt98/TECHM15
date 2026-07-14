"""MSA vs SOW alignment — the cross-document contradiction surface.

Pairs comparable clauses (same clause type / shared defined terms),
generates contradiction candidates, and hands numeric ones to
app.risk_engine.contradictions for deterministic confirmation.
"""


async def align_and_compare(msa_id: str, sow_id: str) -> list[dict]:
    # TODO(compare): clause-type pairing → semantic comparison → candidates.
    raise NotImplementedError
