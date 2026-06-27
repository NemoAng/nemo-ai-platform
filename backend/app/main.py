from fastapi import FastAPI
from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models.user import User  # noqa: F401

from app.ai.providers.factory import get_ai_provider

app = FastAPI(title="Nemo AI Platform")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    with engine.connect() as conn:
        db_result = conn.execute(text("SELECT 1")).scalar()

    return {
        "status": "ok",
        "service": "nemo-ai-platform-backend",
        "database": "ok" if db_result == 1 else "error"
    }

@app.get("/ai/test")
def ai_test(q: str = "Hello AI"):
    provider = get_ai_provider()

    answer = provider.chat([
        {"role": "user", "content": q}
    ])

    embedding = provider.embed(q)

    return {
        "provider": provider.name,
        "question": q,
        "answer": answer,
        "embedding": embedding
    }
