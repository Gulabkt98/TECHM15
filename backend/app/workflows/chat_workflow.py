"""Chat workflow — grounded Q&A over a contract family.

Retrieval is graph-scoped; the answer must cite verified quotes. If the
evidence needed sits behind a missing exhibit, the workflow answers with
the evidence gap instead of a guess.
"""


class ChatWorkflow:
    async def answer(self, contract_family_id: str, question: str) -> dict:
        # TODO(workflow): retriever → Gemini with mandatory-quote schema →
        # grounding verification → answer or explicit refusal with gaps.
        raise NotImplementedError("ChatWorkflow.answer")
