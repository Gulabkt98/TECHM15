"""Comparison workflow — targeted MSA↔SOW or version-to-version runs.

A lighter path than the full review: parse (if needed) → align clause
pairs → contradiction analysis → verified findings.
"""


class ComparisonWorkflow:
    async def run(self, doc_id_a: str, doc_id_b: str) -> dict:
        # TODO(workflow): app.compare.msa_vs_sow / version_compare, then
        # route candidates through the grounding gate before returning.
        raise NotImplementedError("ComparisonWorkflow.run")
