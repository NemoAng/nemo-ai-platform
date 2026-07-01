import requests


class OllamaProvider:
    def __init__(self, model: str = "phi3"):
        self.model = model
        self.base_url = "http://host.docker.internal:11434"

    @property
    def name(self):
        return f"ollama:{self.model}"

    def chat(self, messages):
        response = requests.post(
            f"{self.base_url}/api/chat",
            json={
                "model": self.model,
                "messages": messages,
                "stream": False,
            },
            timeout=60,
        )

        response.raise_for_status()
        data = response.json()

        return data["message"]["content"]

    def embed(self, text: str):
        response = requests.post(
            f"{self.base_url}/api/embed",
            json={
                "model": "nomic-embed-text",
                "input": text,
            },
            timeout=60,
        )

        response.raise_for_status()
        data = response.json()

        return data["embeddings"][0]