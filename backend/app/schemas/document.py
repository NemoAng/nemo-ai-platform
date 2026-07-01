from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str
    content: str
    source_type: str = "text"


class DocumentOut(BaseModel):
    id: int
    title: str
    source_type: str

    model_config = {
        "from_attributes": True
    }


class UploadResponse(BaseModel):
    id: int
    title: str
    source_type: str
    indexed: bool