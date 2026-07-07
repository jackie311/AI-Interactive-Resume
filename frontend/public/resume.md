# Jackie Jin

qing.jin3912@gmail.com | https://www.linkedin.com/in/jackie-qing-jin/ | https://github.com/jackie311

---

## Summary

AI Engineer with 8+ years of full-stack engineering experience, now focused on building LLM and agentic applications for enterprise users. Hands-on across the AI stack — RAG pipelines, document retrieval with embeddings and ChromaDB, LLM orchestration with LangChain and the Claude API, and real-time streaming via Server-Sent Events (SSE) — backed by strong Node.js fundamentals and a track record of secure, scalable APIs. Comfortable in ambiguity, repeatedly taking vague problems from concept to deployed, cloud-native product on AWS.

---

## Skills

**AI Engineering:** Claude API (Anthropic), OpenAI API, LangChain, LangGraph, RAG pipeline design, ChromaDB (vector DB), HuggingFace Embeddings, Hybrid retrieval (BM25 + Dense), Cohere Reranker, Prompt Engineering, Function Calling, Structured Output / JSON Schema, MCP Server, Anthropic Computer Use, Claude Code, Streaming inference (SSE), Token usage & cost monitoring

**Frontend:** React, Next.js, TypeScript, Tailwind CSS, Material UI, Chakra UI

**Backend:** Python, Node.js, FastAPI, Django, REST APIs, GraphQL

**Databases:** PostgreSQL, MySQL, DynamoDB, Redis, ChromaDB

**DevOps & Cloud:** AWS (ECS Fargate, Lambda, S3, CloudFront, EFS, ECR, Cognito, ALB), Docker / Docker Compose, Helm, GitHub Actions (CI/CD)

---

## Experience

### NCS Australia — Senior Software Engineer
*Jun 2022 - Present | Brisbane*

Delivered full-stack solutions for government and enterprise clients across the transport, aviation, energy, and commercial sectors — leading front-end architecture and API integration — while independently building an AI-powered RAG portfolio to demonstrate AI engineering capability.

- Led frontend architecture and delivery across multiple enterprise and government systems, focusing on scalable UI design, performance optimisation, and seamless API integration.
- Delivered end-to-end features in cross-functional agile teams, contributing to both frontend and backend workflows where required.
- Established reusable component libraries and frontend best practices, improving development efficiency and consistency across projects.
- Delivered high-impact digital transformation projects, including the Department of Transport BEAR system and Qantas operational platforms, supporting large-scale user bases and mission-critical workflows.
- Led the technical implementation of the PNG Police Check prototype on AWS, which was showcased at an international government conference.
- Improved deployment efficiency and engineering velocity through better architecture patterns and CI/CD collaboration across teams.

### Healthcarelogic — Full Stack Engineer
*Jun 2018 - Jun 2022*

Full-stack development across a healthcare platform — building business-critical features and internal systems, owning release management and production deployments, and leading a codebase-wide TypeScript migration.

- Built full-stack, data-driven web applications with Node.js, Express, Knex.js, GraphQL, React and TypeScript, delivering business-critical features and internal systems.
- Designed and integrated secure, scalable backend services and APIs; owned release management and production deployments.
- Led the migration to TypeScript across multiple projects, reducing runtime errors and improving maintainability.

---

## AI Engineer Projects

### JiraGPT — Jira-Integrated AI Assistant (2025)
*Natural-language Jira — query, report, bulk-transition and create tickets on a RAG + intent-routing microservice architecture*

A Jira-integrated AI assistant where users query Jira data, generate reports, bulk-transition tickets, create tickets, and produce release notes entirely in natural language — on a RAG + LLM + intent-routing microservice architecture with pluggable local (Ollama) and cloud (Azure AI Foundry) LLM backends, one-command Docker Compose locally, and Helm deploy to Azure AKS.

- Built a Jira + LLM RAG assistant on a microservice architecture (Django + 2× FastAPI + React 19), one-command local Docker Compose, deployed to Azure AKS via Helm.
- Designed a regex-fast-path + LLM-fallback intent router dispatching natural language into 8 business branches (RAG Q&A, Text-to-JQL, ticket creation, bulk transitions, fixVersion, comment summary, release notes, sprint reports).
- Engineered a RAG pipeline: BGE (BAAI/bge-large-en, 1024-dim) embeddings + ChromaDB per-project collections, with scheduled Celery Beat ingestion (nightly 22:00) and Redis-lock-deduplicated on-demand priority backfill.
- Delivered pluggable dual LLM backends (local Ollama llama3 / cloud Azure Llama-3.3-70B-Instruct) switchable via LLM_BACKEND, with Langfuse end-to-end LLM observability (off by default, no-op safe).
- Implemented per-user Fernet-encrypted Jira tokens + Azure AD / MSAL auth, and production secret management via Azure Key Vault (CSI Secrets Store + Workload Identity).
- Text-to-JQL: natural language → JQL, resolving quoted names to Jira accountIds and "me" → currentUser().
- Preview → confirm two-phase writes for ticket creation and bulk transitions (stored in jira_ticket_state).
**Tech:** Python, Django 4.x / DRF, Gunicorn, Celery + Celery Beat, Redis, PostgreSQL 16, FastAPI + Uvicorn (×2: gds data service + vector service), ChromaDB, BGE / sentence-transformers, Ollama, Azure AI Foundry (Llama-3.3-70B), React 19, Vite, Tailwind CSS, Langfuse, Docker, Docker Compose, Kubernetes / Azure AKS, Helm, Azure Container Registry, Azure Key Vault, pytest

### AI Interactive Resume (2026)
*RAG + LLM + AWS — a full AI engineering project, deployed to production*

Designed and full-stack built a production-grade AI application enabling users to interactively query résumé data via natural language, in English or Chinese, with the AI answering in the first person as Jackie. Full RAG lifecycle self-built end-to-end.

- Architected an end-to-end RAG pipeline: YAML-based structured data modelling → semantic chunking with metadata (section/company/project_id) → HuggingFace all-MiniLM-L6-v2 embeddings → ChromaDB vector store → top-k (k=4) similarity retrieval → context injection → LLM generation.
- Implemented LLM orchestration with LangChain + Anthropic Claude API (claude-sonnet-4-6), generating grounded, first-person responses with anti-hallucination constraints and automatic bilingual alignment.
- Built a real-time backend with FastAPI (async ASGI) + Server-Sent Events (SSE) for low-latency token-by-token streaming; maintains last 10 turns of history for coherence vs. token cost.
- Recruiter Mode: heuristically auto-detects when a user pastes a JD and dynamically rewrites the prompt to output a structured match analysis (matched skills, honest gaps, overall fit) — turning a passive résumé into active persuasion.
- Built a conversational UI with Next.js 16 (App Router, SSG) / React 19 / TypeScript / Tailwind CSS 4, with hand-written SSE consumption and incremental Markdown rendering.
- Designed & deployed a cloud-native architecture on AWS (ECS Fargate / EC2, S3 + CloudFront, EFS, ECR); CI/CD with GitHub Actions, including data-driven auto re-embedding when résumé data changes (MLOps).
**Tech:** LangChain, Claude API, ChromaDB, HuggingFace, FastAPI, Next.js, React 19, TypeScript, Tailwind CSS, AWS (ECS Fargate, S3, CloudFront, EFS, ECR), Docker, Docker Compose, GitHub Actions

## Fullstack Projects

### BEAR — Booking Entity Authorisation Reporting (2024)
*Government reporting platform for regulatory workflows across staff and auditors*

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

### Qantas Digital Platforms (2023)
*From maintaining mission-critical pilot apps to delivering a new production system end-to-end*

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

### ConocoPhillips HAAIC Sheet App (2022)
*Digitised electrical-equipment procurement — paperless and signature-ready*

A digital application that replaced paper-based electrical-equipment procurement with responsive, signature-ready digital workflows across desktop, tablet, and mobile.

- Developed a digital application to streamline procurement workflows, replacing manual sourcing and paper-based processes with digital approvals and sign-offs.
- Designed and implemented scalable frontend architecture using React with responsive, cross-device interfaces.
- Built reusable, performance-optimised UI components.
- Integrated with backend APIs for data-driven workflows.
- Collaborated with project managers and stakeholders to deliver on time.

**Impact:** Improved operational efficiency by digitising procurement/approval workflows; established a maintainable frontend architecture; built long-term client trust leading to repeat engagements.
**Tech:** React, JavaScript, Material UI, Jira, Figma

## Other Projects

### PNG Police Check Application (2023)
*Government e-portal prototype in 6 weeks — presented at an international conference*

Built the entire front-end for a Papua New Guinea government police-clearance prototype — part of a national digital-government initiative (akin to myGov) — delivering responsive applications within a six-week deadline.

- Sole front-end developer; built responsive desktop and mobile UIs from Figma designs using Next.js and AWS Amplify.
- Delivered the complete police-clearance workflow under an aggressive six-week, weekly-sprint timeline.

**Impact:** Prototype success led to the Prime Minister of PNG presenting the Government Services ePortal at an international conference in Seattle.
**Tech:** Next.js, JavaScript, AWS Amplify, Figma, Axios

### NCS Consultant CV Tool (2023)
*Internal automation to manage and generate consultant CVs company-wide*

An internal automation tool to standardise and generate consultant CVs company-wide after ARQ Group was acquired by NCS Australia.

- Connected Power Automate to a SharePoint List to auto-generate Word CVs from a standard template.
- Built a Power Apps interface for staff to search, create, and update consultant CVs, following Figma designs.

**Impact:** Eliminated manual CV formatting company-wide; consistent branding from day one.
**Tech:** Microsoft Power Automate, Microsoft Power Apps, SharePoint, Figma

### OzLottoStats (2025)
*Lottery statistics app — historical Oz Lotto draw analysis*

A lottery statistics application that aggregates and visualises historical Oz Lotto draw data — built end-to-end with Claude Code.

- Designed and shipped as a solo project, using Claude Code for rapid delivery.
**Tech:** Claude Code, Web

### Fishing Mate (2025)
*Mobile weather & fishing-conditions companion*

A mobile-first weather and fishing-conditions companion app, built with Claude Code and deployed on Cloudflare Pages.

- Delivered a mobile-first weather and fishing-conditions experience end-to-end.
**Tech:** Claude Code, Cloudflare Pages, Mobile Web

## Education & Certifications

- **Master of Network Management** — Queensland University of Technology (QUT) (2015 - 2017)
- AWS Certified Cloud Practitioner
- Cisco Certified Network Professional (CCNP)
