from openai import OpenAI

from app.ai.providers.base import AIProvider
from app.config.config import settings


class OpenAIProvider(AIProvider):
    name = "openai"

    def __init__(self):
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is not configured")

        self.client = OpenAI(
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url,
        )

    def chat(self, messages: list[dict]) -> str:
        response = self.client.chat.completions.create(
            model=settings.openai_chat_model,
            messages=messages,
            temperature=0.2,
        )

        return response.choices[0].message.content or ""

    def embed(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            model=settings.openai_embedding_model,
            input=text,
        )

        return response.data[0].embedding
