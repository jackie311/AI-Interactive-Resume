# AI 交互式简历 / Portfolio（Conversational RAG Portfolio）

> 一个"会说话的简历"：访客在网页上一边看简历，一边通过常驻聊天侧栏用**中文或英文**向 AI 提问，AI 以**第一人称**代表 Jackie 回答，底层是基于简历数据的 **RAG（检索增强生成）** 系统。整站从数据管道、检索、LLM 流式生成，到前端、容器化、云部署与 CI/CD 全部自建。

🔗 **在线地址**：https://profile.jackiejin.dev

---

## 一句话总结（Resume Bullet）

- 设计并全栈开发了一套 **AI 驱动的对话式 Portfolio**：以 YAML 简历数据为知识源，基于 **HuggingFace 句向量嵌入 + ChromaDB 向量库**构建 RAG 检索层，通过 **Claude API 流式（SSE）**生成第一人称、支持中英双语的回答，并内置 "Recruiter Mode" 自动解析岗位 JD 做匹配度分析。
- 采用 **FastAPI（异步）+ Next.js（React 19 / TypeScript）** 前后端分离架构，**Docker Compose** 容器化，部署于 **AWS（S3 + CloudFront + EC2）**，并用 **GitHub Actions** 实现前端、后端、向量库重建的一键 CI/CD。

---

## 技术栈总览（Tech Stack）

| 层级 | 技术选型 |
|------|----------|
| **LLM / 生成** | Anthropic **Claude API**（`claude-sonnet-4-6`），异步流式输出 |
| **RAG 检索** | **LangChain** + **ChromaDB** 向量库 + **HuggingFace `all-MiniLM-L6-v2`** 句向量嵌入 |
| **后端** | **FastAPI** + **Uvicorn**（ASGI，异步），SSE 流式接口，Pydantic |
| **前端** | **Next.js 16**（App Router，SSG 静态导出）、**React 19**、**TypeScript**、**Tailwind CSS 4**、Framer Motion、Recharts、react-markdown |
| **数据源** | YAML（`resume.yaml` / `projects.yaml`）作为单一事实来源（Single Source of Truth） |
| **容器化** | **Docker** + **Docker Compose**（本地 dev 与 prod 两套 compose 文件） |
| **云与部署** | **AWS**：S3（静态托管）+ CloudFront（CDN / 边缘函数）+ EC2（后端）+ ACM（TLS 证书）+ Elastic IP |
| **CI/CD** | **GitHub Actions**：前端构建部署、后端 SSH 部署、数据变更自动重建向量库 |

---

## AI / LLM 工程亮点（重点）

### 1. RAG 数据管道（Ingestion Pipeline）
- **数据源即知识库**：`resume.yaml` + `projects.yaml` 是唯一事实来源，涵盖个人简介、工作经历、教育、技能、项目、求职意向等结构化字段。
- **分段切块（Chunking）**：`rag/embedder.py` 将 YAML 按语义单元（每段经历 / 每个项目 / 技能块 / 可用性）拆成独立 `Document`，并附带 `metadata`（如 `section`、`company`、`project_id`）以支持后续过滤与溯源。
- **嵌入与索引**：用 **HuggingFace `all-MiniLM-L6-v2`** 生成句向量，写入 **ChromaDB** 持久化向量库；重建时先清空旧索引，保证幂等。

### 2. 检索 + 生成链（Retrieval → Generation）
- **相似度检索**：用户问题向量化后在 ChromaDB 做 **top-k（k=4）相似度检索**，取回最相关的简历片段作为上下文。
- **Prompt 工程**：将检索到的上下文注入 `<resume_context>` 标签，配合精心设计的 **System Prompt**——约束模型（a）以第一人称"我就是 Jackie"作答、（b）**只依据提供的上下文**回答、不知道就诚实说明（**防幻觉**）、（c）**自动语言对齐**（中文提问中文答、英文提问英文答）。
- **流式响应**：后端用 `anthropic.AsyncAnthropic` 的 `messages.stream`，以 **SSE（Server-Sent Events）** 逐 token 推送，前端实时增量渲染，体验接近打字机效果。
- **多轮对话管理**：维护最近 **10 轮**历史注入上下文，兼顾连贯性与 token 成本。

### 3. Recruiter Mode（岗位匹配分析）
- 关键词 + 文本长度启发式**自动检测**用户是否粘贴了 JD（支持中英："job description"、"岗位要求"、长文本等）。
- 命中后动态改写 Prompt，让 AI 输出**结构化匹配分析**：① 命中的技能/经历 ② 诚实指出的差距 ③ 整体契合度总结——把简历从"被动展示"变成"主动说服"。

---

## 后端架构（Backend）

- **框架**：FastAPI + Uvicorn（全异步 ASGI）。
- **路由划分**：
  - `POST /api/chat` — RAG 对话，返回 SSE 流。
  - `GET /api/resume`、`GET /api/resume/projects` — 简历/项目数据接口。
  - `GET /api/github/stats` — 代理 GitHub API，聚合仓库语言占比、Star、Fork，并带 **1 小时内存缓存**降低外部调用。
- **工程细节**：CORS 白名单由 `ALLOWED_ORIGINS` 环境变量驱动；向量库以**单例（lazy singleton）**懒加载，避免每次请求重复初始化；密钥（Anthropic Key、GitHub Token）全部走环境变量，不入库。

## 前端架构（Frontend）

- **Next.js 16 App Router**，**静态导出（SSG）** 到 S3，构建时通过 Server Component 预取简历数据（`INTERNAL_API_URL`）。
- **常驻聊天侧栏**（`ChatPanel.tsx`）：手写 SSE 流式消费、增量渲染、Markdown 渲染、"正在输入"动画、Recruiter Mode 切换、推荐问题引导。
- **数据可视化**：`/stats` 页用 **Recharts** 展示 GitHub 语言占比饼图；整站 Linear 风格暗色主题、Tailwind CSS 4 + Framer Motion 动效。

---

## 部署与 DevOps（Deployment & CI/CD）

### 架构（AWS，Sydney / ap-southeast-2）
```
访客 ──► CloudFront (CDN + TLS)
            ├─ /api/*  ──► EC2 (t2.micro) : FastAPI + Claude API  (Docker)
            └─ 其他    ──► S3            : Next.js 静态站点
```
- **前端**：`next build` 静态导出 → `aws s3 sync` 到 S3 → CloudFront 缓存失效（invalidation）。
- **后端**：EC2 上用 `docker-compose.prod.yml` 运行；ChromaDB 挂 Docker 命名卷持久化到 EBS。
- **CloudFront Function**（`append-html`）：在 viewer-request 阶段做路径重写（`/experience` → `/experience.html`），让静态导出支持干净 URL。
- **TLS**：ACM 通配符证书 `*.jackiejin.dev`（us-east-1）。

### 容器化（Docker）
- 本地 `docker-compose.yml`：一条命令同时起前后端，源码热挂载、`--reload` 热重载。
- 生产 `docker-compose.prod.yml`：仅后端 + 命名卷，数据跨容器重启持久化。

### CI/CD（GitHub Actions，三条流水线）
1. **Deploy Frontend** — `npm ci` → lint → build → S3 sync → CloudFront 失效（支持"仅 CI 不部署"选项）。
2. **Deploy Backend** — 通过 SSH Action 登陆 EC2，`git pull` + `docker compose up --build`。
3. **Run Embedder** — **数据驱动触发**：当 `resume.yaml` / `projects.yaml` 变更 push 时，自动在 EC2 上**重建镜像并重跑向量嵌入**，保证知识库与简历数据始终同步。

---

## 亮点提炼（面向 AI Engineer）

- **完整 RAG 生命周期**：数据切块 → 嵌入 → 向量检索 → Prompt 注入 → 流式生成 → 多轮上下文，全链路自建，不是调 API 的玩具 demo。
- **LLM 工程实践**：System Prompt 设计、防幻觉约束、双语自适应、上下文窗口/成本控制、SSE 流式体验。
- **产品化思维**：Recruiter Mode 把 RAG 从"问答"升级为"针对性说服"的应用场景。
- **端到端交付能力**：从 Python 后端、TypeScript 前端，到 Docker、AWS、CI/CD 全部独立完成——**能把 AI 原型真正部署上线并持续运维**。
- **数据即代码**：YAML 单一事实来源 + 数据变更自动触发向量库重建，体现 MLOps/数据管道意识。

---

## 关键技术关键词（ATS Keywords）

`RAG` · `Retrieval-Augmented Generation` · `LLM` · `Claude API` · `Anthropic` · `Prompt Engineering` ·
`Vector Database` · `ChromaDB` · `Embeddings` · `HuggingFace` · `Sentence Transformers` · `LangChain` ·
`Semantic Search` · `SSE Streaming` · `FastAPI` · `Python` · `Async` · `Next.js` · `React` · `TypeScript` ·
`Tailwind CSS` · `Docker` · `Docker Compose` · `AWS` · `S3` · `CloudFront` · `EC2` · `CI/CD` · `GitHub Actions` · `MLOps`
