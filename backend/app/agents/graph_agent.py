"""Knowledge Graph Agent — builds the clause DAG and runs the gates.

Responsibilities:
1. Persist clauses + typed edges to Neo4j (app.graph.graph_builder).
2. Detect circular references (drafting loops) via SCC.
3. Run the completeness gate: missing INCORPORATES targets → compute the
   blast radius and populate state["evidence_gaps"] (scoped refusal).
"""

from app.agents.state import ReviewState
from app.utils.logger import get_logger

logger = get_logger(__name__)


class GraphAgent:
    name = "graph_builder"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(graph): app.graph.graph_builder.build() →
        # app.graph.dependency.find_cycles() + blast_radius(); mark blocked
        # clauses UNEVALUABLE instead of failing the whole family.
        raise NotImplementedError("GraphAgent.run: wire app.graph services")
