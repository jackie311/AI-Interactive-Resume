from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rag.chain import stream_chat

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


@router.post("")
async def chat(req: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in req.history]

    return StreamingResponse(
        stream_chat(req.message, history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
