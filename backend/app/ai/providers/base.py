from abc import ABC, abstractmethod
from typing import Protocol


class ChatMessage(Protocol):
    role: str
    content: str


class AIProvider(ABC):
    name: str

    @abstractmethod
    def chat(self, messages: list[dict]) -> str:
        pass

    @abstractmethod
    def embed(self, text: str) -> list[float]:
        pass
