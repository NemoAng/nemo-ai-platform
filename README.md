# Nemo AI Platform

A self-hosted AI platform for personal knowledge, document intelligence, Retrieval-Augmented Generation (RAG), AI agents, and future media intelligence.

---

## 🚀 Current Status

Nemo AI Platform is currently under active development and already includes:

- FastAPI backend
- PostgreSQL database
- ChromaDB vector database
- Gemini provider integration
- OpenAI-compatible provider abstraction
- Document ingestion
- Automatic text chunking
- Embedding generation
- Semantic search
- RAG Ask API with source citations
- React + TypeScript frontend
- Nginx deployment under `/ai/`
- HTTPS
- Basic Authentication
- Docker Compose deployment
- Git Flow based development

---

## 🌐 Public URL

### Frontend

```
https://www.nemowang.dpdns.org/ai/
```

### Backend API

```
https://www.nemowang.dpdns.org/ai-api/
```

---

## 🏗 Architecture

```text
Browser
    │
    ▼
Nginx (HTTPS + Basic Auth)
    │
    ├──────────────┐
    ▼              ▼
React UI      FastAPI Backend
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 PostgreSQL      ChromaDB      AI Providers
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
                 Gemini                     OpenAI Compatible
```

---

## 🛠 Tech Stack

### Backend

- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL
- ChromaDB

### AI

- Google Gemini
- OpenAI Compatible API
- Embeddings
- Semantic Search
- Retrieval-Augmented Generation (RAG)

### Frontend

- React
- TypeScript
- Vite

### Infrastructure

- Docker Compose
- Nginx
- Contabo VPS
- HTTPS (Let's Encrypt)
- Basic Authentication

---

## 📂 Project Structure

```text
backend/
frontend/
scripts/
docker-compose.yml
README.md
```

---

## ✨ Current Features

- Upload text documents
- Automatic chunk generation
- Automatic embedding generation
- Automatic indexing into ChromaDB
- Semantic vector search
- AI question answering with retrieved context
- Source citation support
- Provider health check
- Backend health dashboard

---

## 📋 Roadmap

### Phase 1 ✅

- FastAPI
- PostgreSQL
- ChromaDB
- Gemini
- OpenAI Provider
- React Frontend
- Basic RAG

### Phase 2 🚧

- Dashboard
- Provider Management
- OAuth Login
- PDF Upload
- DOCX Upload
- Markdown Import
- Conversation History

### Phase 3

- Nemo VOD Integration
- Video Transcript Indexing
- OCR
- Image Search
- Audio Search

### Phase 4

- MCP Tools
- AI Agents
- Workflow Engine
- Multi-user Support

---

## 📄 License

Personal project by **Nemo Wang**.

```

---
