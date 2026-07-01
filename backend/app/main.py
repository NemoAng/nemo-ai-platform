import fitz
from fastapi import Body, Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.ai.chunker import chunk_text
from app.ai.providers.exceptions import (
    AIProviderAuthError,
    AIProviderError,
    AIProviderQuotaError,
)
from app.ai.providers.factory import get_ai_provider
from app.db.base import Base
from app.db.deps import get_db
from app.db.session import engine
from app.models.document import Document  # noqa: F401
from app.models.document_chunk import DocumentChunk  # noqa: F401
from app.models.user import User  # noqa: F401
from app.repositories.document_repository import (
    create_document,
    delete_document,
    list_document_chunks,
    list_documents,
)
from app.schemas.document import DocumentCreate, DocumentOut
from app.services.embedding_service import (
    delete_document_embeddings,
    index_document_chunks,
)
from app.services.rag_service import ask_ai
from app.services.search_service import semantic_search
from app.vectorstore.chroma import chroma_health

app = FastAPI(title="Nemo AI Platform")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


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


@app.get("/health")
def health():
    with engine.connect() as conn:
        db_result = conn.execute(text("SELECT 1")).scalar()

    return {
        "status": "OK",
        "service": "nemo-ai-platform-backend",
        "database": "OK" if db_result == 1 else "Error",
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
        "embedding": embedding,
    }

from app.ai.providers.factory import get_chat_provider_with_fallback
from app.ai.providers.gemini_provider import GeminiProvider

@app.get("/ai/provider/health")
def ai_provider_health():
    chat_provider = get_chat_provider_with_fallback()
    embedding_provider = GeminiProvider()

    chat_ok = False
    embedding_ok = False
    chat_error = None
    embedding_error = None

    try:
        answer = chat_provider.chat([
            {"role": "user", "content": "Reply with OK only."}
        ])
        chat_ok = bool(answer)
    except Exception as exc:
        chat_error = str(exc)

    try:
        embedding = embedding_provider.embed("health check")
        embedding_ok = isinstance(embedding, list) and len(embedding) > 0
    except Exception as exc:
        embedding_error = str(exc)

    return {
        "provider": chat_provider.name,
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
        "vector_store": "ChromaDB",
        **result,
    }


@app.post("/documents")
def create_document_api(data: DocumentCreate, db: Session = Depends(get_db)):
    doc = create_document(db, data)
    index_result = index_document_chunks(db, doc.id)

    return {
        "id": doc.id,
        "title": doc.title,
        "source_type": doc.source_type,
        "indexed": True,
        "index_result": index_result,
    }


@app.post("/documents/upload")
async def upload_document_api(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    filename = file.filename or "uploaded.pdf"

    if not filename.lower().endswith(".pdf"):
        return JSONResponse(
            status_code=400,
            content={
                "error": "unsupported_file_type",
                "message": "Only PDF upload is currently supported.",
            },
        )

    data = await file.read()

    if not data:
        return JSONResponse(
            status_code=400,
            content={
                "error": "empty_file",
                "message": "Uploaded file is empty.",
            },
        )

    try:
        pdf = fitz.open(stream=data, filetype="pdf")

        text_parts = []
        for page in pdf:
            text_parts.append(page.get_text())

        content = "\n".join(text_parts).strip()

    except Exception as exc:
        return JSONResponse(
            status_code=400,
            content={
                "error": "pdf_parse_failed",
                "message": str(exc),
            },
        )

    if not content:
        return JSONResponse(
            status_code=400,
            content={
                "error": "empty_pdf_text",
                "message": "No extractable text was found in this PDF.",
            },
        )

    doc = create_document(
        db,
        DocumentCreate(
            title=filename,
            content=content,
            source_type="pdf",
        ),
    )

    index_result = index_document_chunks(db, doc.id)

    return {
        "id": doc.id,
        "title": doc.title,
        "source_type": doc.source_type,
        "indexed": True,
        "index_result": index_result,
    }


@app.get("/documents", response_model=list[DocumentOut])
def list_documents_api(db: Session = Depends(get_db)):
    return list_documents(db)


@app.delete("/documents/{document_id}")
def delete_document_api(document_id: int, db: Session = Depends(get_db)):
    embedding_result = delete_document_embeddings(db, document_id)
    deleted = delete_document(db, document_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return {
        "deleted": True,
        "document_id": document_id,
        "embedding_result": embedding_result,
    }


@app.post("/documents/chunk-test")
def chunk_test(data: DocumentCreate):
    chunks = chunk_text(data.content)

    return {
        "title": data.title,
        "chunk_count": len(chunks),
        "chunks": [
            {
                "index": chunk.index,
                "text": chunk.text,
            }
            for chunk in chunks
        ],
    }


@app.get("/documents/{document_id}/chunks")
def get_document_chunks_api(document_id: int, db: Session = Depends(get_db)):
    chunks = list_document_chunks(db, document_id)

    return {
        "document_id": document_id,
        "chunk_count": len(chunks),
        "chunks": [
            {
                "id": chunk.id,
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
            }
            for chunk in chunks
        ],
    }


@app.post("/documents/{document_id}/index")
def index_document_api(document_id: int, db: Session = Depends(get_db)):
    return index_document_chunks(db, document_id)


@app.get("/search")
def search_api(q: str, top_k: int = 5):
    return semantic_search(q, top_k)

@app.post("/ask")
def ask_api(
    data: dict = Body(...),
):
    q = data.get("q")
    top_k = data.get("top_k", 5)
    messages = data.get("messages", [])

    return ask_ai(q, top_k, messages)