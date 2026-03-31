from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from rag.chain import stream_chat
import chat_stats

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    recruiter_mode: bool = False


@router.post("")
async def chat(req: ChatRequest):
    chat_stats.record(is_new_conversation=len(req.history) == 0)
    history = [{"role": m.role, "content": m.content} for m in req.history]

    return StreamingResponse(
        stream_chat(req.message, history, req.recruiter_mode),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/stats")
def get_chat_stats():
    return chat_stats.get()
