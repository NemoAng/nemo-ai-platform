from sqlalchemy.orm import Session

from app.ai.chunker import chunk_text
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.schemas.document import DocumentCreate


def create_document(db: Session, data: DocumentCreate) -> Document:
    doc = Document(
        title=data.title,
        content=data.content,
        source_type=data.source_type,
    )
    db.add(doc)
    db.flush()

    chunks = chunk_text(data.content)

    for chunk in chunks:
        db.add(
            DocumentChunk(
                document_id=doc.id,
                chunk_index=chunk.index,
                content=chunk.text,
            )
        )

    db.commit()
    db.refresh(doc)
    return doc


def list_documents(db: Session) -> list[Document]:
    return db.query(Document).order_by(Document.id.desc()).all()


def get_document(db: Session, document_id: int) -> Document | None:
    return (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )


def list_document_chunks(db: Session, document_id: int) -> list[DocumentChunk]:
    return (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )


def delete_document(db: Session, document_id: int) -> bool:
    doc = get_document(db, document_id)

    if not doc:
        return False

    db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id
    ).delete()

    db.delete(doc)
    db.commit()

    return True