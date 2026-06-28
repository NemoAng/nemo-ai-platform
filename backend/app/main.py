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

from app.vectorstore.chroma import chroma_health

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.document import Document  # noqa: F401
from app.repositories.document_repository import create_document, list_documents
from app.schemas.document import DocumentCreate, DocumentOut

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


@app.get("/ai/provider/health")
def ai_provider_health():
    provider = get_ai_provider()

    chat_ok = False
    embedding_ok = False
    chat_error = None
    embedding_error = None

    try:
        answer = provider.chat([
            {"role": "user", "content": "Reply with OK only."}
        ])
        chat_ok = bool(answer)
    except Exception as exc:
        chat_error = str(exc)

    try:
        embedding = provider.embed("health check")
        embedding_ok = isinstance(embedding, list) and len(embedding) > 0
    except Exception as exc:
        embedding_error = str(exc)

    return {
        "provider": provider.name,
        "chat": {
            "ok": chat_ok,
            "error": chat_error,
        },
        "embedding": {
            "ok": embedding_ok,
            "error": embedding_error,
        },
    }

@app.get("/vector/health")
def vector_health():
    result = chroma_health()

    return {
        "vector_store": "chromadb",
        **result,
    }

@app.post("/documents", response_model=DocumentOut)
def create_document_api(data: DocumentCreate, db: Session = Depends(get_db)):
    return create_document(db, data)


@app.get("/documents", response_model=list[DocumentOut])
def list_documents_api(db: Session = Depends(get_db)):
    return list_documents(db)

