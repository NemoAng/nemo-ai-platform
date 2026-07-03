from app.ai.providers.factory import get_ai_provider
from app.services.search_service import semantic_search
from app.ai.providers.factory import get_chat_provider_with_fallback

def format_sources(matches):
    sources = []
    context_blocks = []

    for i, m in enumerate(matches):
        idx = i + 1

        context_blocks.append(
            f"[{idx}] {m['content']}"
        )

        sources.append({
            "source_number": idx,
            "document_id": m["metadata"].get("document_id"),
            "chunk_id": m["metadata"].get("chunk_id"),
            "chunk_index": m["metadata"].get("chunk_index"),
            "distance": m.get("distance"),
            "content_preview": m["content"][:300],
        })

    context_text = "\n\n".join(context_blocks)

    return context_text, sources


def build_chat_history(messages):
    history = []

    for m in messages[-6:]:  # 限制上下文长度（重要）
        role = "user" if m["role"] == "user" else "assistant"
        history.append({
            "role": role,
            "content": m["content"]
        })

    return history

def build_rag_chat(query: str, top_k: int = 5, messages=None):
    search_result = semantic_search(query, top_k)
    matches = search_result["matches"]

    context_text, sources = format_sources(matches)

    if sources:
        system_prompt = """
You are an AI assistant using RAG.

Use the provided sources to answer.

Rules:
- Cite sources like [1], [2]
- Be concise
- Use bullet points if useful
"""

        user_prompt = f"""
Question:
{query}

Sources:
{context_text}
"""
    else:
        system_prompt = """
You are Nemo AI, a concise and helpful assistant.

Rules:
- Answer directly.
- Do not invent citations.
- Use bullet points only if useful.
"""

        user_prompt = query

    chat_messages = [
        {"role": "system", "content": system_prompt}
    ]

    if messages:
        chat_messages.extend(build_chat_history(messages))

    chat_messages.append({
        "role": "user",
        "content": user_prompt
    })

    return chat_messages, sources



def ask_ai(query: str, top_k: int = 5, messages=None):
    provider = get_chat_provider_with_fallback()

    search_result = semantic_search(query, top_k)
    matches = search_result["matches"]

    context_text, sources = format_sources(matches)

    system_prompt = f"""
You are an AI assistant using RAG.

Use the provided sources to answer.

Rules:
- Cite sources like [1], [2]
- Be concise
- Use bullet points if useful
"""

    user_prompt = f"""
Question:
{query}

Sources:
{context_text}
"""

    chat_messages = [
        {"role": "system", "content": system_prompt}
    ]

    if messages:
        chat_messages.extend(build_chat_history(messages))

    chat_messages.append({
        "role": "user",
        "content": user_prompt
    })

    answer = provider.chat(chat_messages)

    return {
        "provider": provider.name,
        "question": query,
        "answer": answer,
        "sources": sources,
    }

def ask_ai_stream(query: str, top_k: int = 5, messages=None):
    provider = get_chat_provider_with_fallback()
    chat_messages, sources = build_rag_chat(query, top_k, messages)

    yield {
        "type": "meta",
        "provider": provider.name,
        "question": query,
        "sources": sources,
    }

    if not hasattr(provider, "chat_stream"):
        yield {
            "type": "token",
            "content": provider.chat(chat_messages),
        }
        yield {"type": "done"}
        return

    for chunk in provider.chat_stream(chat_messages):
        for char in chunk:
            yield {
                "type": "token",
                "content": char,
            }

    yield {"type": "done"}
