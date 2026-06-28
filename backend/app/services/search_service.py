from app.ai.providers.factory import get_ai_provider
from app.services.embedding_service import COLLECTION_NAME
from app.vectorstore.chroma import get_chroma_client


def semantic_search(query: str, top_k: int = 5) -> dict:
    provider = get_ai_provider()
    client = get_chroma_client()
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    query_embedding = provider.embed(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    matches = []

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for document, metadata, distance in zip(documents, metadatas, distances):
        matches.append({
            "content": document,
            "metadata": metadata,
            "distance": distance,
        })

    return {
        "query": query,
        "provider": provider.name,
        "top_k": top_k,
        "matches": matches,
    }
