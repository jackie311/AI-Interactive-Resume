import yaml
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse

router = APIRouter(prefix="/resume", tags=["resume"])

DATA_DIR = Path(__file__).parent.parent / "data"


@router.get("")
def get_resume():
    with open(DATA_DIR / "resume.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)


@router.get("/projects")
def get_projects():
    with open(DATA_DIR / "projects.yaml", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("projects", [])


@router.get("/download")
def download_resume():
    pdf_path = DATA_DIR / "resume.pdf"
    if not pdf_path.exists():
        return JSONResponse(status_code=404, content={"error": "resume.pdf not found. Place your PDF at backend/data/resume.pdf"})
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="Jackie_Jin_Resume.pdf",
    )
