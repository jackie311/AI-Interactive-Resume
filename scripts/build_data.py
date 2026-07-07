#!/usr/bin/env python3
"""Build backend data + public résumé from the master source of truth.

Source of truth:
  resume/MASTER_RESUME.md   — all prose (contact, bio, experience, projects)
  resume/site-meta.yaml     — display-only structured fields (skills, radar,
                              project ids/flags/links, education, certs, availability)

Generates (DO NOT hand-edit the outputs):
  backend/data/resume.yaml
  backend/data/projects.yaml
  frontend/public/resume.md   (clean public résumé, percentage-free)

Run:  python scripts/build_data.py
Then: cd backend && python -m rag.embedder   (re-embed ChromaDB)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "resume" / "MASTER_RESUME.md"
SITE_META = ROOT / "resume" / "site-meta.yaml"
OUT_RESUME = ROOT / "backend" / "data" / "resume.yaml"
OUT_PROJECTS = ROOT / "backend" / "data" / "projects.yaml"
OUT_PUBLIC_MD = ROOT / "frontend" / "public" / "resume.md"

GENERATED_HEADER = (
    "# GENERATED FILE — DO NOT EDIT BY HAND.\n"
    "# Source of truth: resume/MASTER_RESUME.md + resume/site-meta.yaml\n"
    "# Regenerate with: python scripts/build_data.py\n"
)

# Which master `## ` sections carry projects, and the category each implies.
PROJECT_SECTIONS = {
    "AI Engineer Projects": "ai-engineer",
    "Fullstack Engineer Projects": "fullstack",
    "Other Projects": "other",
}


class BuildError(Exception):
    """Raised on any drift/parse problem so the build fails loudly."""


# --------------------------------------------------------------------------- #
# Markdown splitting helpers
# --------------------------------------------------------------------------- #
def split_sections(md: str) -> dict[str, list[str]]:
    """Split the master into `## Title` -> body-lines (excludes `### ` subheads)."""
    sections: dict[str, list[str]] = {}
    current: str | None = None
    for line in md.splitlines():
        m = re.match(r"^##\s+(.*)$", line)
        if m and not line.startswith("###"):
            current = m.group(1).strip()
            sections[current] = []
        elif current is not None:
            sections[current].append(line)
    return sections


def split_blocks(lines: list[str]) -> list[tuple[str, list[str]]]:
    """Split a section body into (### heading, block-lines) tuples."""
    blocks: list[tuple[str, list[str]]] = []
    heading: str | None = None
    body: list[str] = []
    for line in lines:
        m = re.match(r"^###\s+(.*)$", line)
        if m:
            if heading is not None:
                blocks.append((heading, body))
            heading = m.group(1).strip()
            body = []
        elif heading is not None:
            body.append(line)
    if heading is not None:
        blocks.append((heading, body))
    return blocks


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip().lower()


# --------------------------------------------------------------------------- #
# Field-level parsing
# --------------------------------------------------------------------------- #
LABEL_RE = re.compile(r"^\*\*(One-liner|Headline bullet|Tagline)\:\*\*\s*", re.I)


def strip_inline_md(text: str) -> str:
    """Drop backticks and collapse whitespace (keep the human text)."""
    return re.sub(r"\s+", " ", text.replace("`", "")).strip()


def paren_aware_split(text: str, delim: str) -> list[str]:
    """Split on `delim`, but never inside parentheses."""
    out, buf, depth = [], [], 0
    for ch in text:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth = max(0, depth - 1)
        if ch == delim and depth == 0:
            out.append("".join(buf))
            buf = []
        else:
            buf.append(ch)
    out.append("".join(buf))
    return [strip_inline_md(x) for x in out if strip_inline_md(x)]


def parse_tech(line: str) -> list[str]:
    text = re.sub(r"^\*\*Tech\:\*\*\s*", "", line).strip()
    delim = "·" if "·" in text else ","
    return paren_aware_split(text, delim)


def parse_entry(body: list[str]) -> dict:
    """Parse a project/experience block body into common fields.

    Returns {description, highlights, impact, tech}. `description` is the first
    prose paragraph (blockquote one-liners and plain intros both count); the
    leading italic meta line and bold section labels are ignored.
    """
    description_parts: list[str] = []
    highlights: list[str] = []
    impact = ""
    tech: list[str] = []
    seen_bullets = False
    desc_done = False

    for raw in body:
        line = raw.strip()
        if not line:
            if description_parts:
                desc_done = True
            continue
        if line.startswith("### "):
            continue
        if line.startswith("*") and line.endswith("*") and not line.startswith("**"):
            continue  # italic meta line (company · dates · url)
        if line.startswith("**Tech:**"):
            tech = parse_tech(line)
            continue
        if line.startswith("**Impact:**"):
            impact = strip_inline_md(re.sub(r"^\*\*Impact\:\*\*\s*", "", line))
            continue
        if line.startswith("**ATS keywords:**"):
            continue
        if line.startswith("**Key Achievements:**"):
            continue  # a label; its bullets still get collected below
        if line.startswith("- "):
            seen_bullets = True
            highlights.append(strip_inline_md(line[2:]))
            continue
        # Otherwise it's prose. Only capture it as description before bullets start.
        if not seen_bullets and not desc_done:
            cleaned = line
            cleaned = re.sub(r"^>\s*", "", cleaned)
            cleaned = LABEL_RE.sub("", cleaned)
            description_parts.append(strip_inline_md(cleaned))

    return {
        "description": " ".join(description_parts).strip(),
        "highlights": highlights,
        "impact": impact,
        "tech": tech,
    }


# --------------------------------------------------------------------------- #
# Section builders
# --------------------------------------------------------------------------- #
def build_personal(sections: dict, meta: dict) -> dict:
    contact = sections.get("Contact")
    if not contact:
        raise BuildError("Master is missing a `## Contact` section.")
    fields: dict[str, str] = {}
    for line in contact:
        m = re.match(r"^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|", line)
        if m:
            fields[m.group(1).strip().lower()] = m.group(2).strip()

    pos = sections.get("Positioning / Personal Summary")
    if not pos:
        raise BuildError("Master is missing `## Positioning / Personal Summary`.")
    bio = ""
    for line in pos:
        s = line.strip()
        if not s or s.startswith("**") or s.startswith("-") or s.startswith(">"):
            continue
        bio = strip_inline_md(s)
        break
    if not bio:
        raise BuildError("Could not extract bio from the Positioning section.")

    m = meta.get("personal", {})
    return {
        "name": fields.get("name", "Jackie Jin"),
        "title": m.get("title", "AI Engineer"),
        "email": fields.get("email", ""),
        "location": fields.get("location", ""),
        "github": fields.get("github", ""),
        "linkedin": fields.get("linkedin", ""),
        "open_to_work": bool(m.get("open_to_work", True)),
        "bio": bio,
    }


MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], start=1)}


def parse_start(period: str) -> str | None:
    m = re.search(r"([A-Z][a-z]{2})\s+(\d{4})", period)
    if m and m.group(1) in MONTHS:
        return f"{m.group(2)}-{MONTHS[m.group(1)]:02d}"
    m = re.search(r"(\d{4})", period)
    return m.group(1) if m else None


def parse_meta_line(body: list[str]) -> tuple[str, str]:
    """From a block body, return (period, location) parsed from the italic line."""
    for raw in body:
        s = raw.strip()
        if s.startswith("*") and s.endswith("*") and not s.startswith("**"):
            inner = s.strip("*").strip()
            parts = [p.strip() for p in inner.split("·")]
            period, location = "", ""
            for p in parts:
                if re.search(r"\d{4}", p) and (re.search(r"[–-]", p) or "Present" in p):
                    period = p
                elif not p.startswith("http"):
                    location = location or p
            # Normalise en/em dashes to a plain hyphen (frontend parses "YYYY - YYYY").
            period = re.sub(r"\s*[–—]\s*", " - ", period)
            return period, location
    return "", ""


def build_experience(sections: dict) -> list[dict]:
    body = sections.get("Work Experience")
    if not body:
        raise BuildError("Master is missing `## Work Experience`.")
    jobs = []
    for heading, block in split_blocks(body):
        parts = re.split(r"\s+[—–]\s+", heading, maxsplit=1)
        company = parts[0].strip()
        role = parts[1].strip() if len(parts) > 1 else ""
        period, location = parse_meta_line(block)
        entry = parse_entry(block)
        job = {
            "company": company,
            "role": role,
            "period": period,
            "location": location,
            "description": entry["description"],
            "highlights": entry["highlights"],
            "tech": entry["tech"],
        }
        start = parse_start(period)
        if start:
            job["start"] = start
        jobs.append(job)
    return jobs


def build_projects(sections: dict, meta: dict) -> list[dict]:
    meta_projects = meta.get("projects", {})
    by_heading = {norm(p["heading"]): (pid, p) for pid, p in meta_projects.items()}
    used: set[str] = set()
    projects: list[dict] = []

    for section_title, category in PROJECT_SECTIONS.items():
        body = sections.get(section_title)
        if not body:
            continue
        for heading, block in split_blocks(body):
            key = norm(heading)
            if key not in by_heading:
                raise BuildError(
                    f"Project '{heading}' (section '{section_title}') has no "
                    f"matching entry in site-meta.yaml (add it under projects:)."
                )
            pid, pmeta = by_heading[key]
            used.add(key)
            entry = parse_entry(block)
            proj = {
                "id": pid,
                "name": pmeta.get("name", heading),
                "tagline": pmeta.get("tagline", ""),
                "description": entry["description"] or pmeta.get("tagline", ""),
                "highlights": entry["highlights"],
                "impact": entry["impact"],
                "tech": entry["tech"],
                "github": pmeta.get("github"),
                "live": pmeta.get("live"),
                "featured": bool(pmeta.get("featured", False)),
                "category": pmeta.get("category", category),
                "year": int(pmeta.get("year", 0)),
            }
            projects.append(proj)

    unused = set(by_heading) - used
    if unused:
        names = ", ".join(by_heading[u][0] for u in unused)
        raise BuildError(
            f"site-meta.yaml has project entries with no matching master heading: {names}"
        )
    return projects


# --------------------------------------------------------------------------- #
# Public résumé renderer
# --------------------------------------------------------------------------- #
def render_public_md(resume: dict, projects: list[dict]) -> str:
    p = resume["personal"]
    out = [f"# {p['name']}", ""]
    contact = " | ".join(x for x in [p.get("email"), p.get("linkedin"), p.get("github")] if x)
    out += [contact, "", "---", "", "## Summary", "", p["bio"], "", "---", ""]

    out += ["## Skills", ""]
    sk = resume["skills"]
    for label, key in [("AI Engineering", "ai_ml"), ("Frontend", "frontend"),
                       ("Backend", "backend"), ("Databases", "databases"),
                       ("DevOps & Cloud", "devops_cloud")]:
        if sk.get(key):
            out.append(f"**{label}:** " + ", ".join(sk[key]))
            out.append("")
    out += ["---", "", "## Experience", ""]
    for j in resume["experience"]:
        out.append(f"### {j['company']} — {j['role']}")
        meta = " | ".join(x for x in [j.get("period"), j.get("location")] if x)
        out += [f"*{meta}*", ""]
        if j.get("description"):
            out += [j["description"], ""]
        for h in j["highlights"]:
            out.append(f"- {h}")
        out.append("")

    def emit_projects(title: str, cat: str) -> None:
        group = [pr for pr in projects if pr["category"] == cat]
        if not group:
            return
        out.extend([f"## {title}", ""])
        for pr in group:
            out.append(f"### {pr['name']} ({pr['year']})")
            out.extend([f"*{pr['tagline']}*", ""])
            if pr.get("description"):
                out.extend([pr["description"], ""])
            for h in pr["highlights"]:
                out.append(f"- {h}")
            if pr.get("impact"):
                out.extend(["", f"**Impact:** {pr['impact']}"])
            if pr.get("tech"):
                out.append(f"**Tech:** {', '.join(pr['tech'])}")
            out.append("")

    out += ["---", ""]
    emit_projects("AI Engineer Projects", "ai-engineer")
    emit_projects("Fullstack Projects", "fullstack")
    emit_projects("Other Projects", "other")

    out += ["## Education & Certifications", ""]
    for e in resume["education"]:
        out.append(f"- **{e['degree']}** — {e['institution']} ({e['period']})")
    for c in resume["certifications"]:
        out.append(f"- {c['name']}")
    out.append("")
    return "\n".join(out)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def dump_yaml(path: Path, data, header: str) -> None:
    text = yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=100)
    path.write_text(header + "\n" + text, encoding="utf-8")


def main() -> int:
    md = MASTER.read_text(encoding="utf-8")
    meta = yaml.safe_load(SITE_META.read_text(encoding="utf-8"))
    sections = split_sections(md)

    resume = {
        "personal": build_personal(sections, meta),
        "experience": build_experience(sections),
        "education": meta["education"],
        "skills": {
            "languages": meta["skills"]["languages"],
            "ai_ml": meta["skills"]["ai_ml"],
            "backend": meta["skills"]["backend"],
            "frontend": meta["skills"]["frontend"],
            "databases": meta["skills"]["databases"],
            "devops_cloud": meta["skills"]["devops_cloud"],
            "skill_radar": meta["skills"]["skill_radar"],
        },
        "certifications": meta["certifications"],
        "languages_spoken": meta["languages_spoken"],
        "availability": meta["availability"],
    }
    projects = build_projects(sections, meta)

    dump_yaml(OUT_RESUME, resume, GENERATED_HEADER)
    dump_yaml(OUT_PROJECTS, {"projects": projects}, GENERATED_HEADER)
    OUT_PUBLIC_MD.write_text(render_public_md(resume, projects), encoding="utf-8")

    print(f"[build_data] wrote {OUT_RESUME.relative_to(ROOT)}")
    print(f"[build_data] wrote {OUT_PROJECTS.relative_to(ROOT)} ({len(projects)} projects)")
    print(f"[build_data] wrote {OUT_PUBLIC_MD.relative_to(ROOT)}")
    print(f"[build_data] experience: {len(resume['experience'])} roles")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BuildError as e:
        print(f"[build_data] BUILD FAILED: {e}", file=sys.stderr)
        sys.exit(1)
