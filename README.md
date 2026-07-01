# 🚀 Nemo AI Platform

A production-ready Retrieval-Augmented Generation (RAG) platform that
enables users to upload documents, perform semantic search, and interact
with AI using contextual knowledge.

🌐 Live Demo: https://www.nemowang.dpdns.org/ai

------------------------------------------------------------------------

## ✨ Features

### 📄 Document Management

-   Upload PDF documents (automatic text extraction)
-   Add manual text documents
-   Delete documents (SQLite + ChromaDB sync)
-   Automatic chunking and embedding

### 🔍 Semantic Search

-   Vector-based similarity search
-   Top-K retrieval
-   Distance scoring
-   Chunk-level precision

### 🤖 AI Chat (RAG)

-   Multi-turn conversation
-   Context-aware memory
-   Citation-based answers `[1][2]`
-   Markdown-rendered responses

### 🧠 Conversation Memory

-   Context preserved across turns
-   LocalStorage persistence (no data loss on refresh)

### 📊 System Monitoring

-   Backend health check
-   AI provider health
-   Vector database status

------------------------------------------------------------------------

## 🧱 Architecture

Frontend (React + TypeScript + Vite) ↓ Backend (FastAPI) ↓ RAG Pipeline
├── Chunking ├── Embedding (OpenAI / Gemini) ├── Vector DB (ChromaDB)
└── Semantic Search ↓ PostgreSQL (metadata storage)

------------------------------------------------------------------------

## 🛠 Tech Stack

### Frontend

-   React + TypeScript
-   Vite
-   React Router
-   Markdown Rendering (react-markdown)

### Backend

-   FastAPI
-   SQLAlchemy
-   Pydantic

### AI / RAG

-   OpenAI / Gemini (pluggable providers)
-   ChromaDB (vector storage)
-   Custom chunking + embedding pipeline

### Infrastructure

-   Docker Compose
-   Nginx (reverse proxy)
-   VPS (Contabo)

------------------------------------------------------------------------

## ⚙️ Deployment

### Backend

docker compose up -d --build

### Frontend

cd frontend npm install npm run build

cd .. ./scripts/deploy_frontend.sh

------------------------------------------------------------------------

## 🎯 Key Highlights

-   End-to-end RAG system (not a demo)
-   Multi-provider AI abstraction
-   Production-ready deployment

------------------------------------------------------------------------

## 🧑‍💻 Author

Nemo Wang\
LinkedIn: https://www.linkedin.com/in/nemo-wang/\
GitHub: https://github.com/NemoAng/

------------------------------------------------------------------------

## 📝 License

MIT
