"""Gemini adapter — the ONLY module that talks to the LLM API.

The platform is deliberately LLM-optional: every deterministic feature
works without a key. When GEMINI_API_KEY is set, generate_json() enhances
clause classification and grounded Q&A. Callers must handle None (the
adapter never raises on missing key — honesty over crashing).
"""

import json

from app.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

_client = None


def available() -> bool:
    key = get_settings().gemini_api_key
    return bool(key) and "your-gemini" not in key


def _get_client():
    global _client
    if _client is None:
        from google import genai

        _client = genai.Client(api_key=get_settings().gemini_api_key)
    return _client


async def generate_json(prompt: str) -> dict | None:
    """Call Gemini expecting a JSON object; None when unavailable/failed."""
    if not available():
        return None
    try:
        response = await _get_client().aio.models.generate_content(
            model=get_settings().gemini_model,
            contents=prompt,
            config={"response_mime_type": "application/json", "temperature": 0.1},
        )
        return json.loads(response.text)
    except Exception as exc:
        logger.warning(f"Gemini call failed — falling back to deterministic path: {exc}")
        return None
