from dataclasses import dataclass


@dataclass
class TextChunk:
    index: int
    text: str


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[TextChunk]:
    clean_text = " ".join(text.split())

    if not clean_text:
        return []

    chunks: list[TextChunk] = []
    start = 0
    index = 0

    while start < len(clean_text):
        end = start + chunk_size
        chunk = clean_text[start:end].strip()

        if chunk:
            chunks.append(TextChunk(index=index, text=chunk))
            index += 1

        start = end - overlap

        if start < 0:
            start = 0

        if start >= len(clean_text):
            break

    return chunks
