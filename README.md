# 🚀 Nemo AI Platform

Production-ready Retrieval-Augmented Generation (RAG) system with hybrid
AI architecture.

🌐 Live: https://www.nemowang.dpdns.org/ai/

------------------------------------------------------------------------

## ✨ Highlights

-   🔁 **Multi-provider AI**: Gemini (primary) + **Ollama (phi3)
    fallback**
-   🧠 **RAG pipeline**: chunking → embeddings → vector search →
    grounded answers
-   📄 **PDF ingestion**: upload & auto-index
-   💬 **Chat with memory**: multi-turn + citations
-   🧩 **Provider decoupling**: Chat vs Embedding split for stability
-   🐳 **Dockerized**: one-command deploy

------------------------------------------------------------------------

## 🧱 Architecture

Frontend (React + TS + Vite) ↓ FastAPI Backend ↓ RAG Pipeline ├──
Chunking ├── Embedding (Gemini) ├── Vector DB (ChromaDB) └── Retrieval ↓
Chat Provider ├── Gemini (primary) └── Ollama (fallback: phi3) ↓
PostgreSQL (metadata)

------------------------------------------------------------------------

## 🛠 Tech Stack

**Frontend** - React, TypeScript, Vite, React Router

**Backend** - FastAPI, SQLAlchemy, Pydantic

**AI / RAG** - Gemini (chat + embeddings) - Ollama (local LLM: phi3) -
ChromaDB (vector store)

**Infra** - Docker Compose, Nginx, VPS

------------------------------------------------------------------------

## ⚙️ Run

``` bash
docker compose up -d --build
```

Frontend:

``` bash
cd frontend
npm install
npm run build
cd ..
./scripts/deploy_frontend.sh
```

------------------------------------------------------------------------

## 🔁 AI Strategy

-   **Chat**: Gemini → fallback to Ollama (phi3) on quota/limits
-   **Embedding**: Gemini (stable, fast)
-   Ensures **availability** and **cost control**

------------------------------------------------------------------------

## 📸 Screens

-   Dashboard (health)
-   Chat (RAG + citations)
-   Documents (PDF upload/index)
-   Search (semantic)

------------------------------------------------------------------------

## 🧑‍💻 Author

Nemo Wang\
LinkedIn: https://www.linkedin.com/in/nemo-wang/ \
GitHub: https://github.com/NemoAng/

------------------------------------------------------------------------

## 📄 License

MIT
