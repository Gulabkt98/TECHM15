"""RAG Agent — graph-scoped retrieval for downstream analysis agents.

Indexes clause chunks (clause-boundary, never mid-clause) and assembles
context packs: clause text + IDs + offsets, filtered to the dependency
neighborhood of the clause under analysis.
"""

from app.agents.state import ReviewState


class RagAgent:
    name = "retrieval"

    async def run(self, state: ReviewState) -> ReviewState:
        # TODO(rag): app.rag.chunker → embeddings → vector_store.upsert;
        # then retriever.retrieve(scope=graph neighborhood) + reranker.
        raise NotImplementedError("RagAgent.run: wire app.rag services")
