# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

AI-powered interactive resume/portfolio site. Visitors see a resume + always-visible chat sidebar where they can ask questions about Jackie's background in English or Chinese. The AI speaks in first person as Jackie, using RAG over resume YAML files.

## Commands

### Docker (recommended — one command to start everything)
```bash
docker compose up --build   # first time or after code/dependency changes
docker compose up           # subsequent runs
```

### Backend (manual)
```bash
cd backend
source .venv/Scripts/activate          # Windows; use .venv/bin/activate on Mac/Linux
uvicorn main:app --reload              # http://localhost:8000

# After editing data/resume.yaml or data/projects.yaml:
python rag/embedder.py                 # re-embed into ChromaDB
```

### Frontend (manual)
```bash
cd frontend
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## Architecture

### Data flow
`backend/data/resume.yaml` + `data/projects.yaml` → `rag/embedder.py` → ChromaDB (`chroma_db/`) → `rag/chain.py` retrieves context → Claude API streams response → frontend SSE

**Important**: The YAML files are the source of truth. After editing them, `rag/embedder.py` must be re-run to update the vector store.

### Backend
- `main.py` — FastAPI app, CORS config reads `ALLOWED_ORIGINS` env var
- `routes/chat.py` — `POST /api/chat`, returns SSE stream
- `routes/resume.py` — `GET /api/resume`, `GET /api/resume/projects`
- `routes/github.py` — `GET /api/github/stats`, proxies GitHub API with 1hr in-memory cache
- `rag/chain.py` — lazy-loads ChromaDB vectorstore (singleton), retrieves top-4 docs, streams via `anthropic.AsyncAnthropic`. Model: `claude-sonnet-4-6`, max 10 turns of history
- `rag/embedder.py` — `HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")` for embeddings

### Frontend
- `src/lib/api.ts` — all backend calls; base URL from `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api`)
- `src/app/page.tsx` — 70/30 layout: resume left, `ChatPanel` right
- `src/app/projects/page.tsx` — project grid
- `src/app/stats/page.tsx` — GitHub stats + Recharts pie chart
- `src/components/chat/ChatPanel.tsx` — SSE streaming chat, Recruiter Mode (paste JD for fit analysis)

### Docker
- `docker-compose.yml` at root — spins up both services
- Backend mounts `backend/chroma_db/` and `backend/data/` as volumes (data persists across restarts)
- Frontend `NEXT_PUBLIC_API_URL` is a build-time ARG (default `http://localhost:8000/api`); change in `docker-compose.yml` args for non-local deployment

## Environment Variables

**`backend/.env`** (required):
```
ANTHROPIC_API_KEY=...
GITHUB_TOKEN=...
GITHUB_USERNAME=jackie311
ALLOWED_ORIGINS=http://localhost:3000
```

**`frontend/.env.local`** (optional):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
