"""Gemini 2.5 Pro adapter — the ONLY module that talks to the LLM API.

Thin by design: agents depend on generate_structured(), so swapping the
model/provider is a one-file change. Temperature stays low; outputs are
schema-validated before any agent consumes them.
"""

from app.config import get_settings


async def generate_structured(prompt: str, response_schema: dict) -> dict:
    """Call Gemini with an enforced JSON schema; return parsed output."""
    settings = get_settings()
    # TODO(llm): google-genai client call with response_schema enforcement,
    # retries with backoff, and token-usage logging for the audit trail.
    raise NotImplementedError(f"Gemini adapter not wired (model={settings.gemini_model})")
