from sqlalchemy.orm import Session

from app.ai.providers.factory import get_ai_provider
from app.models.document_chunk import DocumentChunk
from app.vectorstore.chroma import get_chroma_client


COLLECTION_NAME = "document_chunks"


def index_document_chunks(db: Session, document_id: int) -> dict:
    provider = get_ai_provider()
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
        embedding = provider.embed(chunk.content)

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
        "provider": provider.name,
        "collection": COLLECTION_NAME,
    }
