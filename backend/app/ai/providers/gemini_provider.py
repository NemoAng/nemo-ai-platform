from openai import AuthenticationError, OpenAI, RateLimitError, APIConnectionError, APIStatusError

from app.ai.providers.base import AIProvider
from app.ai.providers.exceptions import (
    AIProviderAuthError,
    AIProviderError,
    AIProviderQuotaError,
)
from app.config.config import settings


class GeminiProvider(AIProvider):
    name = "gemini"

    def __init__(self):
        if not settings.gemini_api_key:
            raise AIProviderAuthError("GEMINI_API_KEY is not configured", provider=self.name)

        self.client = OpenAI(
            api_key=settings.gemini_api_key,
            base_url=settings.gemini_base_url,
        )

    def chat(self, messages: list[dict]) -> str:
        try:
            response = self.client.chat.completions.create(
                model=settings.gemini_chat_model,
                messages=messages,
                temperature=0.2,
            )
            return response.choices[0].message.content or ""

        except AuthenticationError as exc:
            raise AIProviderAuthError("Gemini authentication failed", provider=self.name) from exc

        except RateLimitError as exc:
            raise AIProviderQuotaError("Gemini quota or rate limit exceeded", provider=self.name) from exc

        except (APIConnectionError, APIStatusError) as exc:
            raise AIProviderError("Gemini API request failed", provider=self.name) from exc

    def embed(self, text: str) -> list[float]:
        try:
            response = self.client.embeddings.create(
                model=settings.gemini_embedding_model,
                input=text,
            )
            return response.data[0].embedding

        except AuthenticationError as exc:
            raise AIProviderAuthError("Gemini authentication failed", provider=self.name) from exc

        except RateLimitError as exc:
            raise AIProviderQuotaError("Gemini quota or rate limit exceeded", provider=self.name) from exc

        except (APIConnectionError, APIStatusError) as exc:
            raise AIProviderError("Gemini API request failed", provider=self.name) from exc
