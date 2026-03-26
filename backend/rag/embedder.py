"""
Loads resume.yaml + projects.yaml, converts to documents, and embeds into ChromaDB.
Run once (or on data update) to build the vector index.
"""

import yaml
from pathlib import Path
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

DATA_DIR = Path(__file__).parent.parent / "data"
CHROMA_DIR = Path(__file__).parent.parent / "chroma_db"


def load_resume() -> dict:
    with open(DATA_DIR / "resume.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_projects() -> dict:
    with open(DATA_DIR / "projects.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)


def build_documents(resume: dict, projects: dict) -> list[Document]:
    docs = []

    # Personal bio
    p = resume["personal"]
    docs.append(Document(
        page_content=f"Name: {p['name']}\nTitle: {p['title']}\nLocation: {p['location']}\nBio: {p['bio']}",
        metadata={"section": "personal"}
    ))

    # Experience
    for job in resume.get("experience", []):
        content = (
            f"Company: {job['company']}\n"
            f"Role: {job['role']}\n"
            f"Period: {job['period']}\n"
            f"Description: {job['description']}\n"
            f"Key achievements:\n" + "\n".join(f"- {h}" for h in job["highlights"]) + "\n"
            f"Technologies used: {', '.join(job['tech'])}"
        )
        docs.append(Document(page_content=content, metadata={"section": "experience", "company": job["company"]}))

    # Education
    for edu in resume.get("education", []):
        content = (
            f"Institution: {edu['institution']}\n"
            f"Degree: {edu['degree']}\n"
            f"Period: {edu['period']}\n"
            f"GPA: {edu.get('gpa', 'N/A')}\n"
            f"Highlights:\n" + "\n".join(f"- {h}" for h in edu.get("highlights", []))
        )
        docs.append(Document(page_content=content, metadata={"section": "education"}))

    # Skills
    skills = resume.get("skills", {})
    skill_text = "Technical Skills:\n"
    skill_text += "Programming Languages: " + ", ".join(
        f"{s['name']} ({s['years']} yrs)" for s in skills.get("languages", [])
    ) + "\n"
    skill_text += "Frontend: " + ", ".join(skills.get("frontend", [])) + "\n"
    skill_text += "Backend: " + ", ".join(skills.get("backend", [])) + "\n"
    skill_text += "Databases: " + ", ".join(skills.get("databases", [])) + "\n"
    skill_text += "DevOps & Cloud: " + ", ".join(skills.get("devops_cloud", [])) + "\n"
    skill_text += "AI & ML: " + ", ".join(skills.get("ai_ml", [])) + "\n"
    docs.append(Document(page_content=skill_text, metadata={"section": "skills"}))

    # Availability
    avail = resume.get("availability", {})
    avail_text = (
        f"Availability: {avail.get('status', 'Not specified')}\n"
        f"Preferred roles: {', '.join(avail.get('preferred_roles', []))}\n"
        f"Preferred stack: {', '.join(avail.get('preferred_stack', []))}\n"
        f"Work arrangement: {', '.join(avail.get('work_arrangement', []))}\n"
        f"Notice period: {avail.get('notice_period', 'N/A')}\n"
        f"Languages spoken: {', '.join(resume.get('languages_spoken', []))}"
    )
    docs.append(Document(page_content=avail_text, metadata={"section": "availability"}))

    # Projects
    for proj in projects.get("projects", []):
        content = (
            f"Project: {proj['name']}\n"
            f"Tagline: {proj['tagline']}\n"
            f"Description: {proj['description']}\n"
            f"Problem solved: {proj.get('problem', '')}\n"
            f"Solution: {proj.get('solution', '')}\n"
            f"Impact: {proj.get('impact', '')}\n"
            f"Technologies: {', '.join(proj['tech'])}\n"
            f"Year: {proj.get('year', '')}"
        )
        docs.append(Document(page_content=content, metadata={"section": "project", "project_id": proj["id"]}))

    return docs


def get_vectorstore() -> Chroma:
    """Return existing vector store (for querying)."""
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return Chroma(persist_directory=str(CHROMA_DIR), embedding_function=embeddings)


def build_vectorstore() -> Chroma:
    """Build and persist vector store from data files."""
    resume = load_resume()
    projects = load_projects()
    docs = build_documents(resume, projects)

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR),
    )
    print(f"Embedded {len(docs)} documents into ChromaDB at {CHROMA_DIR}")
    return vectorstore


if __name__ == "__main__":
    build_vectorstore()
