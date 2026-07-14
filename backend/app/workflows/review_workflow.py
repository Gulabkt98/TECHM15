"""Review workflow — runs the full multi-agent pipeline for a family.

The supervisor graph is imported lazily so the API process never pays
the LangGraph/LLM import cost; only workers execute reviews.
"""

from app.utils.logger import get_logger

logger = get_logger(__name__)


class ReviewWorkflow:
    async def run(self, contract_family_id: str) -> dict:
        from app.agents.supervisor import compile_review_pipeline

        pipeline = compile_review_pipeline()
        state = {"contract_family_id": contract_family_id}
        logger.info("Review pipeline starting", extra={"family": contract_family_id})
        result = await pipeline.ainvoke(state)
        # TODO(workflow): persist verified findings / rejected claims /
        # evidence gaps + append audit events per stage transition.
        return result
