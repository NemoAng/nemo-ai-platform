import requests
import json

from app.config.config import settings


class OllamaProvider:
    def __init__(
        self,
        model: str | None = None,
        base_url: str | None = None,
        embedding_model: str | None = None,
    ):
        self.model = model or settings.ollama_chat_model
        self.base_url = (base_url or settings.ollama_base_url).rstrip("/")
        self.embedding_model = embedding_model or settings.ollama_embedding_model

    @property
    def name(self):
        return f"ollama:{self.model}"

    def _build_prompt(self, messages):
        parts = []

        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")

            if role == "system":
                parts.append(f"<|system|>\n{content}<|end|>")
            elif role == "assistant":
                parts.append(f"<|assistant|>\n{content}<|end|>")
            else:
                parts.append(f"<|user|>\n{content}<|end|>")

        parts.append("<|assistant|>\n")
        return "\n".join(parts)

    def chat(self, messages):
        response = requests.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model,
                "prompt": self._build_prompt(messages),
                "stream": False,
                "options": {
                    "num_predict": 512,
                    "stop": [
                        "<|end|>",
                        "<|user|>",
                        "<|assistant|>",
                        "<|system|>",
                        "\n---",
                        "\n------",
                        "\n指令",
                        "\nInstruction",
                    ],
                },
            },
            timeout=180,
        )

        response.raise_for_status()
        data = response.json()

        return data["response"].strip()

    def chat_stream(self, messages):
        response = requests.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model,
                "prompt": self._build_prompt(messages),
                "stream": True,
                "options": {
                    "num_predict": 512,
                    "stop": [
                        "<|end|>",
                        "<|user|>",
                        "<|assistant|>",
                        "<|system|>",
                        "\n---",
                        "\n------",
                        "\n指令",
                        "\nInstruction",
                    ],
                },
            },
            timeout=180,
            stream=True,
        )

        response.raise_for_status()

        for line in response.iter_lines(decode_unicode=True):
            if not line:
                continue

            data = json.loads(line)
            chunk = data.get("response", "")

            if chunk:
                yield chunk

            if data.get("done"):
                break

    def embed(self, text: str):
        response = requests.post(
            f"{self.base_url}/api/embed",
            json={
                "model": self.embedding_model,
                "input": text,
            },
            timeout=180,
        )

        response.raise_for_status()
        data = response.json()

        return data["embeddings"][0]
