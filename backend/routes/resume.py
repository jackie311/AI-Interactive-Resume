import yaml
from pathlib import Path
from fastapi import APIRouter

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
