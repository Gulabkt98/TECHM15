"""Composed LLM call sequences (classify → extract → verify) used by agents."""


async def classify_and_extract(clause: dict) -> dict:
    # TODO(llm): prompts.CLASSIFY_CLAUSE → gemini.generate_structured →
    # output_parser validation.
    raise NotImplementedError
