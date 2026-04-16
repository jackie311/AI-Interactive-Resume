# Jackie Jin — AI Interactive Resume

AI-powered portfolio site with an always-visible chat sidebar. Visitors can ask questions about my experience, skills, and projects in English or Chinese.

**Live**: https://www.jackiejin.dev

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Backend | Python FastAPI + ChromaDB (RAG) + Claude API |
| Infra | AWS S3 + CloudFront / ECS Fargate + ALB / EFS |

## Local Dev

**Recommended — Docker:**
```bash
docker compose up --build
# Frontend: http://localhost:3000 | Backend: http://localhost:8000
```

**Manual:**
```bash
# Backend
cd backend && source .venv/Scripts/activate
uvicorn main:app --reload

# Frontend
cd frontend && npm run dev
```

Required: `backend/.env` with `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `GITHUB_USERNAME=jackie311`

## Data

Resume content lives in `backend/data/resume.yaml` and `projects.yaml`.
After editing, re-run the embedder to update the AI's knowledge:

```bash
cd backend && python rag/embedder.py
```

## CI/CD

Three GitHub Actions workflows (manual trigger via Actions tab):

| Workflow | What it does |
|---|---|
| **Deploy Frontend** | Build + lint → S3 sync → CloudFront invalidation |
| **Deploy Backend** | Docker build → ECR push → ECS force deploy |
| **Run Embedder** | Re-embed YAML data on ECS → restart backend |

Requires GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
