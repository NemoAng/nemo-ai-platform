from fastapi import FastAPI
from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models.user import User  # noqa: F401

from app.ai.providers.factory import get_ai_provider

from fastapi.responses import JSONResponse

from app.ai.providers.exceptions import (
    AIProviderAuthError,
    AIProviderError,
    AIProviderQuotaError,
)

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

@app.exception_handler(AIProviderQuotaError)
def ai_quota_error_handler(request, exc: AIProviderQuotaError):
    return JSONResponse(
        status_code=429,
        content={
            "error": "ai_provider_quota_exceeded",
            "provider": exc.provider,
            "message": exc.message,
        },
    )


@app.exception_handler(AIProviderAuthError)
def ai_auth_error_handler(request, exc: AIProviderAuthError):
    return JSONResponse(
        status_code=401,
        content={
            "error": "ai_provider_auth_failed",
            "provider": exc.provider,
            "message": exc.message,
        },
    )


@app.exception_handler(AIProviderError)
def ai_provider_error_handler(request, exc: AIProviderError):
    return JSONResponse(
        status_code=502,
        content={
            "error": "ai_provider_error",
            "provider": exc.provider,
            "message": exc.message,
        },
    )


