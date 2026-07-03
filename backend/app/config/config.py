from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Nemo AI Platform"
    environment: str = "development"

    database_url: str

    default_ai_provider: str = "dummy"
    chroma_host: str = "chromadb"
    chroma_port: int = 8000
    ollama_base_url: str = "http://host.docker.internal:11434"
    ollama_chat_model: str = "phi3"
    ollama_embedding_model: str = "nomic-embed-text"

    openai_api_key: str | None = None
    openai_base_url: str | None = None
    openai_chat_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"

    gemini_api_key: str | None = None
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/"
    gemini_chat_model: str = "gemini-2.5-flash"
    gemini_embedding_model: str = "text-embedding-004"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
