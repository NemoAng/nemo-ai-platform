import chromadb

from app.config.config import settings


def get_chroma_client():
    return chromadb.HttpClient(
        host=settings.chroma_host,
        port=settings.chroma_port,
    )


def chroma_health() -> dict:
    client = get_chroma_client()
    heartbeat = client.heartbeat()

    return {
        "status": "ok",
        "heartbeat": heartbeat,
    }
