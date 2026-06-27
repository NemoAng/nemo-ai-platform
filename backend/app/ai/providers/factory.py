from app.ai.providers.base import AIProvider
from app.ai.providers.dummy import DummyProvider


def get_ai_provider(provider_name: str = "dummy") -> AIProvider:
    if provider_name == "dummy":
        return DummyProvider()

    raise ValueError(f"Unsupported AI provider: {provider_name}")
