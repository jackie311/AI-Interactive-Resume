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

### AWS Deployment (production)

**Redeploy frontend** (after any frontend code or data change):
```bash
cd frontend
npm run build
aws s3 sync out/ s3://myresume-frontend-041875151540/ --delete --region ap-southeast-2
aws cloudfront create-invalidation --distribution-id E2VLNB8O1DB4Y7 --paths "/*" --region us-east-1
```

**Redeploy backend** (after backend code change):
```bash
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 041875151540.dkr.ecr.ap-southeast-2.amazonaws.com
docker build -t myresume-backend ./backend
docker tag myresume-backend:latest 041875151540.dkr.ecr.ap-southeast-2.amazonaws.com/myresume-backend:latest
docker push 041875151540.dkr.ecr.ap-southeast-2.amazonaws.com/myresume-backend:latest
aws ecs update-service --cluster myresume-cluster --service myresume-backend-service --force-new-deployment --region ap-southeast-2
```

**Re-run embedder** (after editing resume.yaml or projects.yaml):
```bash
aws ecs run-task \
  --cluster myresume-cluster \
  --task-definition myresume-backend \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-03ff39fd91d5192dd],securityGroups=[sg-0cfa3c2e86d87e0a0],assignPublicIp=ENABLED}" \
  --overrides '{"containerOverrides":[{"name":"backend","command":["python","rag/embedder.py"]}]}' \
  --region ap-southeast-2
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

### AWS (production)
- **URL**: https://d33qsa6f99h2bi.cloudfront.net
- **Region**: ap-southeast-2 (Sydney)
- Frontend: S3 (`myresume-frontend-041875151540`) + CloudFront (`E2VLNB8O1DB4Y7`)
- Backend: ECS Fargate (`myresume-cluster` / `myresume-backend-service`) behind ALB
- ChromaDB: persisted on EFS (`fs-09fd412861c85bf26`) mounted at `/app/chroma_db`
- Secrets: AWS Secrets Manager (`myresume/backend`) — ANTHROPIC_API_KEY, GITHUB_TOKEN, ALLOWED_ORIGINS
- CloudFront routes `/api/*` → ALB, everything else → S3

## Environment Variables

**`backend/.env`** (required):
```
ANTHROPIC_API_KEY=...
GITHUB_TOKEN=...
GITHUB_USERNAME=jackie311
ALLOWED_ORIGINS=http://localhost:3000
```

**`frontend/.env.local`** (optional for local dev, required for production builds):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api        # local dev
INTERNAL_API_URL=http://localhost:8000/api           # build-time server-side fetch (local dev)
```

For production builds, `frontend/.env.local` must set both:
```
NEXT_PUBLIC_API_URL=https://d33qsa6f99h2bi.cloudfront.net/api
INTERNAL_API_URL=http://myresume-alb-1732503466.ap-southeast-2.elb.amazonaws.com/api
```
`INTERNAL_API_URL` is used by Next.js Server Components at build time (SSG). Without it, build-time data fetches fall back to `http://backend:8000/api` (Docker-only) and pages render empty.
