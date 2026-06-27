# Nemo AI Platform Architecture

## Vision

Nemo AI Platform is a self-hosted AI platform for personal knowledge, media intelligence, document search, and agent workflows.

The goal is to build a real production-style AI platform, not a small demo.

## Goals

- Self-hosted deployment on VPS
- Secure access with preconfigured users
- AI provider abstraction
- Document intelligence
- Retrieval-Augmented Generation
- Vector search
- Future video, email, file, and agent integrations
- Production-style Docker deployment

## Non-Goals

- No training custom foundation models
- No heavy AI inference on Raspberry Pi
- No OpenWrt integration
- No public anonymous access

## Deployment

Primary domain:

https://www.nemowang.dpdns.org

Initial API path:

/ai-api/

Future frontend path:

/ai/

## High-Level Architecture

Browser
→ Nginx
→ FastAPI Backend
→ PostgreSQL
→ ChromaDB
→ AI Providers

## Components

### Backend

FastAPI service responsible for:

- REST API
- Authentication
- User management
- Document ingestion
- AI provider orchestration
- RAG workflow
- Admin and health endpoints

### Database

PostgreSQL stores:

- Users
- Settings
- Documents metadata
- Conversations
- Provider configuration
- Audit logs

### Vector Database

ChromaDB stores:

- Text chunks
- Embeddings
- Source metadata
- Retrieval indexes

### AI Providers

The platform will support multiple AI providers through a common provider interface:

- OpenAI
- Gemini
- Azure OpenAI
- Ollama

### Frontend

React + TypeScript frontend for:

- Dashboard
- Documents
- Search
- AI Chat
- Settings
- Admin
- Health monitoring

## Security Model

Access is restricted to preconfigured users.

Initial version:

- Username and password login
- Password hashing
- Session or JWT authentication
- Admin role

Future version:

- OAuth support
- GitHub login
- Google login
- Microsoft login

## Raspberry Pi Role

Raspberry Pi is not the AI compute server.

It acts as a future data source for:

- Nemo VOD
- Media files
- Documents
- Logs
- Local services

The AI Platform runs primarily on the Contabo VPS.

## Roadmap

### v0.1

- Backend health API
- Docker deployment
- PostgreSQL
- User table
- Basic architecture docs

### v0.2

- Authentication
- Preconfigured admin user
- Password hashing
- Protected API routes

### v0.3

- AI provider abstraction
- OpenAI-compatible provider
- Gemini provider
- Provider settings

### v0.4

- Document upload
- Chunking
- Embeddings
- ChromaDB integration

### v0.5

- Ask AI
- RAG
- Citations
- Conversation history

### v0.6

- React frontend
- Login page
- Dashboard
- Documents UI
- Settings UI

### v0.7

- Nemo VOD integration
- Video transcript indexing
- Ask Video

### v0.8

- Agent workflows
- MCP-style tool integration

### v1.0

- Stable public portfolio release
