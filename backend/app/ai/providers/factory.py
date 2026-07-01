from app.ai.providers.base import AIProvider
from app.ai.providers.dummy import DummyProvider
from app.ai.providers.gemini_provider import GeminiProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.ai.providers.ollama_provider import OllamaProvider
from app.config.config import settings


def get_ai_provider(provider_name: str | None = None) -> AIProvider:
    selected_provider = provider_name or settings.default_ai_provider

    if selected_provider == "dummy":
        return DummyProvider()

    if selected_provider == "openai":
        return OpenAIProvider()

    if selected_provider == "gemini":
        return GeminiProvider()

    if selected_provider == "ollama":
        return OllamaProvider()

    raise ValueError(f"Unsupported AI provider: {selected_provider}")


def get_chat_provider_with_fallback() -> AIProvider:
    primary = settings.default_ai_provider

    try:
        provider = get_ai_provider(primary)

        # Only test embedding with Gemini
        embedding_provider = GeminiProvider()
        embedding_provider.embed("health check")

        return provider

    except Exception as e:
        print(f"[AI] Primary provider failed: {primary}, error={e}")
        print("[AI] Falling back to Ollama...")

        return OllamaProvider(model="phi3")
