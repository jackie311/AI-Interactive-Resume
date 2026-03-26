import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.resume import router as resume_router
from routes.github import router as github_router

app = FastAPI(title="Jackie Jin — Portfolio API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(resume_router, prefix="/api")
app.include_router(github_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "message": "Jackie Jin Portfolio API"}


@app.get("/health")
def health():
    return {"status": "healthy"}
