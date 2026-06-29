from app.ai.providers.factory import get_ai_provider
from app.services.search_service import semantic_search


def ask_ai(question: str, top_k: int = 5) -> dict:
    provider = get_ai_provider()

    search_result = semantic_search(question, top_k)
    matches = search_result["matches"]

    context_blocks = []
    sources = []

    for index, match in enumerate(matches, start=1):
        metadata = match.get("metadata") or {}
        content = match.get("content") or ""

        context_blocks.append(f"[Source {index}]\n{content}")

        sources.append({
            "source_number": index,
            "document_id": metadata.get("document_id"),
            "chunk_id": metadata.get("chunk_id"),
            "chunk_index": metadata.get("chunk_index"),
            "distance": match.get("distance"),
            "content_preview": content[:300],
        })

    context = "\n\n".join(context_blocks)

    messages = [
        {
            "role": "system",
            "content": (
                "You are Nemo AI Platform. Answer the user's question using only the provided context. "
                "If the context does not contain the answer, say you do not know based on the available documents. "
                "When useful, reference the source numbers."
            ),
        },
        {
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion:\n{question}",
        },
    ]

    answer = provider.chat(messages)

    return {
        "question": question,
        "answer": answer,
        "provider": provider.name,
        "sources": sources,
    }
