from sqlalchemy.orm import Session

from app.ai.providers.gemini_provider import GeminiProvider
from app.models.document_chunk import DocumentChunk
from app.vectorstore.chroma import get_chroma_client


COLLECTION_NAME = "document_chunks"


def index_document_chunks(db: Session, document_id: int) -> dict:
    # ❌ 不再用默认 provider
    # provider = get_ai_provider()

    # ✅ 强制用 Gemini 做 embedding
    embedding_provider = GeminiProvider()

    client = get_chroma_client()
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    indexed = 0

    for chunk in chunks:
        embedding = embedding_provider.embed(chunk.content)

        collection.add(
            ids=[f"doc-{document_id}-chunk-{chunk.id}"],
            embeddings=[embedding],
            documents=[chunk.content],
            metadatas=[
                {
                    "document_id": document_id,
                    "chunk_id": chunk.id,
                    "chunk_index": chunk.chunk_index,
                }
            ],
        )

        indexed += 1

    return {
        "document_id": document_id,
        "indexed_chunks": indexed,
        "provider": "gemini",  # 👈 明确标识
        "collection": COLLECTION_NAME,
    }


def delete_document_embeddings(db: Session, document_id: int) -> dict:
    client = get_chroma_client()
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    ids = [
        f"doc-{document_id}-chunk-{chunk.id}"
        for chunk in chunks
    ]

    if ids:
        collection.delete(ids=ids)

    return {
        "document_id": document_id,
        "deleted_embeddings": len(ids),
        "collection": COLLECTION_NAME,
    }