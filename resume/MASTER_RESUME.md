# Jackie Jin — Master Résumé (Source of Truth)

> **This file is the single source of truth (master) for all résumé material.**
> Consolidated from `resume.docx` (latest curated résumé — the canonical layout), `Jackie_Jin_Resume.pdf`, `skills_and_projects.md`, and everything under `/Project`.
> The `resume-variant` skill reads THIS file to generate JD-tailored résumé variants.
> Keep this file factual and complete. Do **not** invent facts here — variants may re-frame, but never fabricate beyond what lives in this master.

---

## Contact

| Field | Value |
|---|---|
| **Name** | Jackie Jin |
| **Phone** | 0406208836 |
| **Email** | qing.jin3912@gmail.com |
| **LinkedIn** | https://www.linkedin.com/in/jackie-qing-jin/ |
| **GitHub** | https://github.com/jackie311 |
| **Portfolio** | https://profile.jackiejin.dev/ |
| **Location** | Brisbane, Australia |
| **Work rights** | Permanent Resident |

---

## Positioning / Personal Summary

**Primary framing (AI Engineer) — polished 2026-07-07 (supersedes the earlier `resume.docx` wording):**
AI Engineer with 8+ years of full-stack engineering experience, now focused on building LLM and agentic applications for enterprise users. Hands-on across the AI stack — RAG pipelines, document retrieval with embeddings and ChromaDB, LLM orchestration with LangChain and the Claude API, and real-time streaming via Server-Sent Events (SSE) — backed by strong Node.js fundamentals and a track record of secure, scalable APIs. Comfortable in ambiguity, repeatedly taking vague problems from concept to deployed, cloud-native product on AWS.

**Alternate framings available** (pick per JD):
- **Senior Frontend / Full Stack Engineer** — 8+ yrs React / Next.js / TypeScript across enterprise & government platforms.
- **AI Engineer / LLM Application Engineer** — end-to-end RAG, agents, multi-agent, MLOps, cloud deployment.
- **Full Stack + Cloud** — AWS-native delivery, Docker, Helm, CI/CD.

---

## Skills (Master Inventory)

> **Skills strictly match `resume.docx`.** Technologies the user is not confident listing as standalone skills (Azure / AKS / Key Vault / MSAL, Kubernetes, ArgoCD, React Native, Express, Knex.js, Redux, Jotai, Bootstrap, Framer Motion, Recharts, LangSmith, Cursor, Copilot, Celery, Streamlit, Azure SQL, EC2/Amplify/ACM) are intentionally **NOT** in this Skills list. They still legitimately appear inside the **project / experience descriptions** below (JiraGPT, Qantas, Healthcarelogic, etc. — team/collaboration context). Variants may reference such tech **only within those bullets**, never as a standalone skill.

> **Résumé skill order (generated résumés MUST follow this):** AI Engineering Skills first, then Full Stack Skills. Frontend, Backend, Cloud/DevOps, and Database all live under **Full Stack Skills**.

## A. AI Engineering Skills

### AI Engineering — Core
- Anthropic API / SDK, OpenAI API / SDK
- Prompt Engineering, Function Calling
- JSON Schema Validation, Structured Output
- Tokenisation, Token Usage Monitoring & Cost Estimation
- MCP Server, MCP Tunnels
- Multi-modal: Claude Vision, GPT-4o
- Model Selection · Model Routing

### Prompt & Context Engineering
- ReAct, Few-Shot Prompting, Chain-of-Thought (CoT)
- Tool-Use Prompt Design, Function Calling, Structured Output & JSON Schema Design
- Context window management, Context compaction, Prompt caching
- Conversation history management, Context summarisation, Token counting

### RAG
- Embeddings: OpenAI `text-embedding-3-small`, HuggingFace `all-MiniLM-L6-v2`, `BAAI/bge-large-en`
- Vector DB: ChromaDB
- Reranker: Cohere reranker
- Hybrid retrieval: BM25 search + Dense retrieval

### Agent / Multi-Agent
- LangChain, LangGraph
- Anthropic Computer Use
- AI Coding: Claude Code, Codex

## B. Full Stack Skills

### Frontend
- React, Next.js, TypeScript, Tailwind CSS, Material UI, Chakra UI

### Backend & APIs
- Python, Node.js, FastAPI, Django
- REST & GraphQL APIs

### Cloud & DevOps
- AWS: ECS Fargate, Lambda, S3, CloudFront, EFS, ECR, Cognito, ALB
- Docker / Docker Compose, Helm, GitHub Actions CI/CD

### Database
- PostgreSQL, MySQL, DynamoDB, Redis

---

## AI Engineer Projects

> **Résumé order (matches `resume.docx`):** Summary → Skills → **AI Engineer Projects** → **Fullstack Engineer Projects** → **Work Experience** → Other Projects → Education & Certifications. Render these as **distinct sections** — do NOT fold the enterprise projects into the Work Experience bullets, and do NOT condense them away.

### JiraGPT — Jira-Integrated AI Assistant Platform
*Personal / Work Project*

> **One-liner:** A Jira-integrated AI assistant where users query Jira data, generate reports, bulk-transition tickets, create tickets, and produce release notes entirely in natural language — on a RAG + LLM + intent-routing microservice architecture with pluggable local (Ollama) and cloud (Azure AI Foundry) LLM backends, one-command Docker Compose locally, and Helm deploy to Azure AKS.

- Built a Jira + LLM RAG assistant on a microservice architecture (Django + 2× FastAPI + React 19), one-command local Docker Compose, deployed to Azure AKS via Helm.
- Designed a regex-fast-path + LLM-fallback intent router dispatching natural language into 8 business branches (RAG Q&A, Text-to-JQL, ticket creation, bulk transitions, fixVersion, comment summary, release notes, sprint reports).
- Engineered a RAG pipeline: BGE (`BAAI/bge-large-en`, 1024-dim) embeddings + ChromaDB per-project collections, with scheduled Celery Beat ingestion (nightly 22:00) and Redis-lock-deduplicated on-demand priority backfill.
- Delivered pluggable dual LLM backends (local Ollama llama3 / cloud Azure Llama-3.3-70B-Instruct) switchable via `LLM_BACKEND`, with Langfuse end-to-end LLM observability (off by default, no-op safe).
- Implemented per-user Fernet-encrypted Jira tokens + Azure AD / MSAL auth, and production secret management via Azure Key Vault (CSI Secrets Store + Workload Identity).
- Text-to-JQL: natural language → JQL, resolving quoted names to Jira accountIds and "me" → `currentUser()`.
- Preview → confirm two-phase writes for ticket creation and bulk transitions (stored in `jira_ticket_state`).

**Tech:** Python · Django 4.x / DRF · Gunicorn · Celery + Celery Beat · Redis · PostgreSQL 16 · FastAPI + Uvicorn (×2: `gds` data service + vector service) · ChromaDB · BGE / sentence-transformers · Ollama · Azure AI Foundry (Llama-3.3-70B) · React 19 · Vite · Tailwind CSS · Langfuse · Docker · Docker Compose · Kubernetes / Azure AKS · Helm · Azure Container Registry · Azure Key Vault · pytest

### AI Interactive Resume / Conversational RAG Portfolio
*Personal Project · https://profile.jackiejin.dev · (résumé lists Apr 2026)*

> **Headline bullet:** Designed and full-stack built a production-grade AI application enabling users to interactively query résumé data via natural language, in English or Chinese, with the AI answering in the first person as Jackie. Full RAG lifecycle self-built end-to-end.

- Architected an end-to-end RAG pipeline: YAML-based structured data modelling → semantic chunking with metadata (section/company/project_id) → HuggingFace `all-MiniLM-L6-v2` embeddings → ChromaDB vector store → top-k (k=4) similarity retrieval → context injection → LLM generation.
- Implemented LLM orchestration with LangChain + Anthropic Claude API (`claude-sonnet-4-6`), generating grounded, first-person responses with anti-hallucination constraints and automatic bilingual alignment.
- Built a real-time backend with FastAPI (async ASGI) + Server-Sent Events (SSE) for low-latency token-by-token streaming; maintains last 10 turns of history for coherence vs. token cost.
- Recruiter Mode: heuristically auto-detects when a user pastes a JD and dynamically rewrites the prompt to output a structured match analysis (matched skills, honest gaps, overall fit) — turning a passive résumé into active persuasion.
- Built a conversational UI with Next.js 16 (App Router, SSG) / React 19 / TypeScript / Tailwind CSS 4, with hand-written SSE consumption and incremental Markdown rendering.
- Designed & deployed a cloud-native architecture on AWS (ECS Fargate / EC2, S3 + CloudFront, EFS, ECR); CI/CD with GitHub Actions, including data-driven auto re-embedding when résumé data changes (MLOps).

**Tech:** LangChain, Claude API, ChromaDB, HuggingFace, FastAPI, Next.js, React 19, TypeScript, Tailwind CSS, AWS (ECS Fargate, S3, CloudFront, EFS, ECR), Docker, Docker Compose, GitHub Actions
**ATS keywords:** RAG · Retrieval-Augmented Generation · LLM · Claude API · Anthropic · Prompt Engineering · Vector Database · ChromaDB · Embeddings · HuggingFace · LangChain · Semantic Search · SSE Streaming · FastAPI · Python · Next.js · React · TypeScript · Docker · AWS · CI/CD · GitHub Actions · MLOps

---

## Fullstack Engineer Projects

> Full-detail enterprise / government projects. In `resume.docx` these are a distinct, prominent section placed **between AI Engineer Projects and Work Experience** — render them as separate entries with their bullets, Impact, and Tech (not folded into Work Experience).

### Booking Entity Authorisation Reporting (BEAR)
*Department of Transport and Main Roads · Brisbane · Oct 2024 – Mar 2026 · https://bear.tmr.qld.gov.au/*

A government reporting platform supporting regulatory workflows for internal staff and external auditors at the Department of Transport and Main Roads — built around dynamic form systems and administrative dashboards, responsive across desktop/tablet/mobile, and fully WCAG-compliant.

- Developed and delivered a government reporting platform supporting regulatory workflows for internal staff and external auditors.
- Built complex, data-driven UIs including dynamic form systems and administrative dashboards for structured data submission and validation.
- Designed and implemented responsive, cross-device interfaces (desktop, tablet, mobile) for a consistent experience across form factors.
- Ensured full compliance with WCAG accessibility standards, balancing usability with strict government requirements.
- Designed reusable component libraries and frontend architecture patterns, improving consistency and maintainability.
- Collaborated in an agile team (2-week sprints) with backend engineers, stakeholders, and auditors.
- Integrated APIs and handled complex data flows for reliable data processing and real-time user interactions.
- Contributed to CI/CD workflows using GitHub Actions across multiple deployment environments.

**Impact:** Delivered features reliably under tight sprint cycles while maintaining stability in a multi-stakeholder environment; reduced future maintenance costs through standardised frontend architecture.
**Tech:** React, Next.js, TypeScript, AWS, GitHub Actions

### ELogbook, QETouch, Port Supervisor Page
*Qantas · Oct 2023 – Oct 2024*

Contributed to multiple Qantas operational platforms — iPad apps (ELogbook, QETouch) used by pilots and engineers, and an internal administrative dashboard — then independently designed and built the Port Supervisor Page from hand-drawn concepts through to production and cloud deployment.

- Contributed to multiple Qantas operational platforms, including iPad applications (ELogbook, QETouch) used by pilots and engineers, and an administrative dashboard for internal users.
- Maintained and enhanced the dashboard system, debugging across frontend and backend to ensure reliability in a production-critical environment.
- Worked with React Native-based mobile apps despite no prior iOS experience, ramping up quickly on shared codebases.
- Participated in monthly release cycles across multiple applications, supporting deployment coordination.
- Acted as release-day support / backup lead during Qantas release windows (issue triage, communication, monitoring).
- Independently designed and built the Port Supervisor Page from hand-drawn concepts to production, owning frontend development and integrating with backend via new API endpoints.
- Collaborated with internal cloud teams to deploy using Kubernetes and ArgoCD.
- Established deployment pipelines across dev, test, and production environments.

**Impact:** Port Supervisor Page substantially reduced deployment time through improved CI/CD; ensured stable operation of mission-critical systems; progressed from maintenance to independently delivering a new production system end-to-end.
**Tech:** React Native, React, Node.js, TypeScript, AWS Cognito, Kubernetes, ArgoCD

### HAAIC Sheet App
*ConocoPhillips Australia · Brisbane · Oct 2022 – Dec 2022*

A digital application that replaced paper-based electrical-equipment procurement with responsive, signature-ready digital workflows across desktop, tablet, and mobile.

- Developed a digital application to streamline procurement workflows, replacing manual sourcing and paper-based processes with digital approvals and sign-offs.
- Designed and implemented scalable frontend architecture using React with responsive, cross-device interfaces.
- Built reusable, performance-optimised UI components.
- Integrated with backend APIs for data-driven workflows.
- Collaborated with project managers and stakeholders to deliver on time.

**Impact:** Improved operational efficiency by digitising procurement/approval workflows; established a maintainable frontend architecture; built long-term client trust leading to repeat engagements.
**Tech:** React, JavaScript, Material UI, Jira, Figma

---

## Work Experience

### NCS Australia — Senior Software Engineer
*Brisbane · Jun 2022 – Present*

Delivered full-stack solutions for government and enterprise clients across the transport, aviation, energy, and commercial sectors — leading front-end architecture and API integration — while independently building an AI-powered RAG portfolio to demonstrate AI engineering capability.

- Led frontend architecture and delivery across multiple enterprise and government systems, focusing on scalable UI design, performance optimisation, and seamless API integration.
- Delivered end-to-end features in cross-functional agile teams, contributing to both frontend and backend workflows where required.
- Established reusable component libraries and frontend best practices, improving development efficiency and consistency across projects.

**Key Achievements:**
- Delivered high-impact digital transformation projects, including the Department of Transport BEAR system and Qantas operational platforms, supporting large-scale user bases and mission-critical workflows.
- Led the technical implementation of the PNG Police Check prototype on AWS, which was showcased at an international government conference.
- Improved deployment efficiency and engineering velocity through better architecture patterns and CI/CD collaboration across teams.

**Tech:** Python · FastAPI · LangChain · ChromaDB · Claude API · TypeScript · React · Next.js · Node.js · AWS · Docker · GitHub Actions

### Healthcarelogic — Full Stack Engineer
*Jun 2018 – Jun 2022*

Full-stack development across a healthcare platform — building business-critical features and internal systems, owning release management and production deployments, and leading a codebase-wide TypeScript migration.

- Built full-stack, data-driven web applications with Node.js, Express, Knex.js, GraphQL, React and TypeScript, delivering business-critical features and internal systems.
- Designed and integrated secure, scalable backend services and APIs; owned release management and production deployments.
- Led the migration to TypeScript across multiple projects, reducing runtime errors and improving maintainability.

**Tech:** JavaScript · TypeScript · React · GraphQL · Node.js · Express · Knex.js · PostgreSQL

---

## Other Projects

> Smaller government / internal / side projects. Rendered on the portfolio as "Other" project cards. OzLottoStats and Fishing Mate were built with Claude Code.

### PNG Police Check Application
*Papua New Guinea Government · Jan 2023 – Mar 2023*

Built the entire front-end for a Papua New Guinea government police-clearance prototype — part of a national digital-government initiative (akin to myGov) — delivering responsive applications within a six-week deadline.

- Sole front-end developer; built responsive desktop and mobile UIs from Figma designs using Next.js and AWS Amplify.
- Delivered the complete police-clearance workflow under an aggressive six-week, weekly-sprint timeline.

**Impact:** Prototype success led to the Prime Minister of PNG presenting the Government Services ePortal at an international conference in Seattle.
**Tech:** Next.js · JavaScript · AWS Amplify · Figma · Axios

### NCS Consultant CV Tool
*NCS Australia · 2023*

An internal automation tool to standardise and generate consultant CVs company-wide after ARQ Group was acquired by NCS Australia.

- Connected Power Automate to a SharePoint List to auto-generate Word CVs from a standard template.
- Built a Power Apps interface for staff to search, create, and update consultant CVs, following Figma designs.

**Impact:** Eliminated manual CV formatting company-wide; consistent branding from day one.
**Tech:** Microsoft Power Automate · Microsoft Power Apps · SharePoint · Figma

### OzLottoStats
*Personal Project · https://www.ozlottostats.app/*

A lottery statistics application that aggregates and visualises historical Oz Lotto draw data — built end-to-end with Claude Code.

- Designed and shipped as a solo project, using Claude Code for rapid delivery.

**Tech:** Claude Code · Web

### Fishing Mate
*Personal Project · https://fishing-mate.pages.dev/#/weather*

A mobile-first weather and fishing-conditions companion app, built with Claude Code and deployed on Cloudflare Pages.

- Delivered a mobile-first weather and fishing-conditions experience end-to-end.

**Tech:** Claude Code · Cloudflare Pages · Mobile Web

---

## Education & Certifications
- **Master of Network Management** — Queensland University of Technology
- **AWS Certified Cloud Practitioner**
- **Cisco Certified Network Professional (CCNP)**

---

## Reusable Metrics & Proof Points (for variants)

> Quantified, verifiable claims established in source material (PDF/original). `resume.docx` keeps the 40% and ~70% figures; the 15+/30%/99.9% Healthcarelogic metrics are real (from the original PDF) but were trimmed from the docx — available if a JD wants extra measurable impact.
>
> ⚠️ **User decision (2026-07-07):** Do NOT put percentage-based performance KPIs on generated résumés by default — the user can't reliably recall/defend these older figures in interviews. This covers the 40% (TS errors), ~70% / 40min→12min (Qantas deploy), 30% / 15+ features (NCS), and 99.9% uptime / <2hr (Healthcarelogic). Keep them here as a factual archive, but leave them off résumé variants unless the user explicitly asks. AI-project *technical* parameters (k=4, 9 microservices, 1024-dim, last 10 turns, 8 branches) are fine to keep — they're the user's own design decisions and easy to speak to.

- **40%** reduction in runtime errors (TypeScript migration, Healthcarelogic) — in docx
- **~70%** deployment-time reduction (~40 min → 12 min) — Qantas Port Supervisor Page CI/CD — in docx
- **30%** reduction in new-feature dev time (reusable component systems, **15+ features**) — original PDF, not in docx
- **99.9%** system uptime; **< 2 hr** avg incident resolution — original PDF, not in docx
- **k=4** top-k retrieval, **last 10 turns** context window, **1024-dim** BGE embeddings — AI project specifics
- **8 intent branches**, **9 microservices**, **nightly 22:00** ingestion — JiraGPT scale points
- **8+ years** total engineering experience

---

## Fact-Integrity Rules (read before generating any variant)

1. **Never fabricate** employers, dates, titles, degrees, certifications, or metrics not present in this file.
2. Re-framing is allowed: emphasise/de-emphasise, reorder, retitle the summary, choose which projects appear.
3. Keyword injection is allowed **only** for skills/tools genuinely present in this master. If a JD requires something absent here, surface it as a **gap** — do not silently add it.
4. Metrics may be reused verbatim but not amplified or newly invented.
5. Dates are as written (note: the PDF lists some forward-dated entries, e.g. BEAR to Mar 2026 and the AI project as Apr 2026 — preserve as-is unless the user corrects them).
6. **Section structure follows `resume.docx`:** AI Engineer Projects → Fullstack Engineer Projects → Work Experience → Other Projects → Education. Keep the enterprise projects as their own section; never condense them into Work Experience.
