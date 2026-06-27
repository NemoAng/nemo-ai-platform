from app.ai.providers.base import AIProvider


class DummyProvider(AIProvider):
    name = "dummy"

    def chat(self, messages: list[dict]) -> str:
        last_message = messages[-1]["content"] if messages else ""
        return f"Dummy AI response: {last_message}"

    def embed(self, text: str) -> list[float]:
        # Temporary fake embedding for architecture testing.
        # Real providers will return high-dimensional vectors.
        return [float(len(text)), float(sum(ord(c) for c in text[:100]) % 1000)]
