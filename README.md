# Jackie Jin — AI Interactive Resume

AI-powered portfolio site with an always-visible chat sidebar. Visitors can ask questions about my experience, skills, and projects in English or Chinese.

**Live**: https://profile.jackiejin.dev

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Backend | Python FastAPI + ChromaDB (RAG) + Claude API |
| Infra | AWS S3 + CloudFront / EC2 t2.micro (Docker) |

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

## Deploy

**Frontend** — run locally after any frontend code or data change:
```bash
cd frontend && npm run build
aws s3 sync out/ s3://myresume-330759080485/ --delete --region ap-southeast-2
aws cloudfront create-invalidation --distribution-id E3QWWKLYQ6ALDB --paths "/*" --region us-east-1
```

**Backend** — SSH into EC2, then:
```bash
ssh -i myresume-key.pem ubuntu@3.24.107.104
cd myResume && git pull
docker compose -f docker-compose.prod.yml up -d --build
```

**Re-embed** — run on EC2 after editing resume.yaml or projects.yaml:
```bash
# (already SSH'd in)
docker compose -f docker-compose.prod.yml exec backend python rag/embedder.py
```
