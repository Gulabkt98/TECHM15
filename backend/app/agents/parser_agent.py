"""Parser Agent — documents in, clause registry out.

Delegates to app.parser.* services (deterministic first, LLM assist
second) and records char-offset provenance for every extracted span.
"""

from app.agents.state import ReviewState
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ParserAgent:
    name = "parser"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(parser): call app.parser.pdf_parser / docx_parser →
        # section_parser → clause_extractor → table_extractor, then store
        # the clause registry and set state["parsed_documents"].
        raise NotImplementedError("ParserAgent.run: wire app.parser services")
