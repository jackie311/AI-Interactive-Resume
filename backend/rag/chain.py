"""
RAG chain: retrieves relevant resume context, then calls Claude API with streaming.
"""

import os
import json
import asyncio
from typing import AsyncGenerator

import anthropic
from langchain_chroma import Chroma

from rag.embedder import get_vectorstore

_vectorstore: Chroma | None = None


def get_store() -> Chroma:
    global _vectorstore
    if _vectorstore is None:
        _vectorstore = get_vectorstore()
    return _vectorstore


SYSTEM_PROMPT = """You are an AI assistant representing Jackie Jin, a full stack engineer.
You speak in first person on Jackie's behalf, as if you ARE Jackie.
You are friendly, professional, and enthusiastic about technology.

You have access to Jackie's resume, work experience, projects, and skills.
Answer questions based ONLY on the provided context. If you don't know something,
say so honestly — don't make up information.

If the user writes in Chinese, respond in Chinese. Otherwise respond in English.

When in recruiter mode (user pastes a job description), analyze how Jackie's skills
match the role, highlight strengths, and honestly note any gaps.

Keep answers concise (2-4 sentences) unless the user asks for detail."""


def detect_recruiter_mode(message: str) -> bool:
    """Detect if user is pasting a job description."""
    jd_keywords = ["job description", "jd:", "requirements:", "responsibilities:",
                   "we are looking for", "qualifications:", "职位描述", "岗位要求"]
    lower = message.lower()
    return any(kw in lower for kw in jd_keywords) or len(message) > 500


async def stream_chat(message: str, history: list[dict]) -> AsyncGenerator[str, None]:
    """
    Retrieve relevant context and stream Claude's response as SSE events.
    Yields strings in SSE format: "data: ...\n\n"
    """
    # Retrieve relevant context
    store = get_store()
    docs = store.similarity_search(message, k=4)
    context = "\n\n---\n\n".join(doc.page_content for doc in docs)

    # Build recruiter mode note
    recruiter_note = ""
    if detect_recruiter_mode(message):
        recruiter_note = "\n\nThe user has shared a job description. Analyze fit carefully."

    system = SYSTEM_PROMPT + recruiter_note + f"\n\n<resume_context>\n{context}\n</resume_context>"

    # Build message history for Claude
    claude_messages = []
    for msg in history[-10:]:  # last 10 turns max
        claude_messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    claude_messages.append({"role": "user", "content": message})

    client = anthropic.AsyncAnthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    async with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=claude_messages,
    ) as stream:
        async for text in stream.text_stream:
            # SSE format
            yield f"data: {json.dumps({'text': text})}\n\n"

    yield "data: [DONE]\n\n"
