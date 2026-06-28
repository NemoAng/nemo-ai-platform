from sqlalchemy.orm import Session

from app.models.document import Document
from app.schemas.document import DocumentCreate


def create_document(db: Session, data: DocumentCreate) -> Document:
    doc = Document(
        title=data.title,
        content=data.content,
        source_type=data.source_type,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def list_documents(db: Session) -> list[Document]:
    return db.query(Document).order_by(Document.id.desc()).all()
