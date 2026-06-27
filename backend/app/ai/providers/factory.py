from app.ai.providers.base import AIProvider
from app.ai.providers.dummy import DummyProvider
from app.config.config import settings


def get_ai_provider(provider_name: str | None = None) -> AIProvider:
    selected_provider = provider_name or settings.default_ai_provider

    if selected_provider == "dummy":
        return DummyProvider()

    raise ValueError(f"Unsupported AI provider: {selected_provider}")
