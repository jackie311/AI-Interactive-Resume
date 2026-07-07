#!/usr/bin/env python3
"""Render a Claude-flavored A4 résumé HTML from the generated backend data.

Reads backend/data/resume.yaml + projects.yaml (themselves generated from
resume/MASTER_RESUME.md by build_data.py) and writes a print-ready, self-contained
A4 HTML to resume-exports/resume.html. Then render to PDF with Chrome headless:

  chrome --headless --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="frontend/public/resume.pdf" "file:///.../resume-exports/resume.html"

Run: python scripts/build_resume_pdf.py    (then the Chrome step; see CLAUDE.md)
"""
from __future__ import annotations

import html
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
RESUME = ROOT / "backend" / "data" / "resume.yaml"
PROJECTS = ROOT / "backend" / "data" / "projects.yaml"
OUT_HTML = ROOT / "resume-exports" / "resume.html"

# How many bullets to show per project in the PDF (keeps it to ~2 pages).
MAX_PROJECT_BULLETS = 4


def esc(x) -> str:
    return html.escape(str(x)) if x is not None else ""


def chips(items: list[str]) -> str:
    return "".join(f'<span class="chip">{esc(i)}</span>' for i in items)


def bullets(items: list[str], limit: int | None = None) -> str:
    items = items[:limit] if limit else items
    return "".join(f"<li>{esc(b)}</li>" for b in items)


def render() -> str:
    resume = yaml.safe_load(RESUME.read_text(encoding="utf-8"))
    projects = yaml.safe_load(PROJECTS.read_text(encoding="utf-8"))["projects"]
    p = resume["personal"]

    contact = " &nbsp;·&nbsp; ".join(
        x for x in [
            esc(p.get("location")),
            f'<a href="mailto:{esc(p["email"])}">{esc(p["email"])}</a>',
            f'<a href="{esc(p["github"])}">github.com/jackie311</a>',
            f'<a href="{esc(p["linkedin"])}">linkedin.com/in/jackie-qing-jin</a>',
        ] if x
    )

    # Skills
    sk = resume["skills"]
    skill_rows = "".join(
        f'<div class="skill-row"><span class="skill-label">{label}</span>'
        f'<span class="skill-vals">{", ".join(esc(v) for v in sk.get(key, []))}</span></div>'
        for label, key in [
            ("AI Engineering", "ai_ml"), ("Frontend", "frontend"),
            ("Backend", "backend"), ("Databases", "databases"),
            ("DevOps &amp; Cloud", "devops_cloud"),
        ] if sk.get(key)
    )

    # Experience
    exp_html = ""
    for j in resume["experience"]:
        meta = " · ".join(x for x in [esc(j.get("role")), esc(j.get("location"))] if x)
        exp_html += f"""
        <div class="entry">
          <div class="entry-head">
            <span class="entry-org">{esc(j['company'])}</span>
            <span class="entry-date">{esc(j.get('period'))}</span>
          </div>
          <div class="entry-sub">{meta}</div>
          <ul>{bullets(j.get('highlights', []))}</ul>
        </div>"""

    def project_block(proj: dict, show_bullets: int) -> str:
        tagline = f'<div class="proj-tagline">{esc(proj["tagline"])}</div>' if proj.get("tagline") else ""
        blist = f"<ul>{bullets(proj.get('highlights', []), show_bullets)}</ul>" if proj.get("highlights") else ""
        impact = f'<div class="impact"><b>Impact:</b> {esc(proj["impact"])}</div>' if proj.get("impact") else ""
        tech = f'<div class="tech">{chips(proj.get("tech", []))}</div>' if proj.get("tech") else ""
        return f"""
        <div class="entry">
          <div class="entry-head">
            <span class="entry-org">{esc(proj['name'])}</span>
            <span class="entry-date">{esc(proj.get('year'))}</span>
          </div>
          {tagline}{blist}{impact}{tech}
        </div>"""

    ai = [pr for pr in projects if pr["category"] == "ai-engineer"]
    fs = [pr for pr in projects if pr["category"] == "fullstack"]
    other = [pr for pr in projects if pr["category"] == "other"]

    ai_html = "".join(project_block(pr, MAX_PROJECT_BULLETS) for pr in ai)
    fs_html = "".join(project_block(pr, 3) for pr in fs)
    other_html = "".join(
        f'<div class="other-item"><b>{esc(pr["name"])}</b> — {esc(pr["tagline"])}</div>'
        for pr in other
    )

    # Education & certs
    edu_html = "".join(
        f'<div class="entry"><div class="entry-head">'
        f'<span class="entry-org">{esc(e["degree"])}</span>'
        f'<span class="entry-date">{esc(e.get("period"))}</span></div>'
        f'<div class="entry-sub">{esc(e["institution"])}</div></div>'
        for e in resume["education"]
    )
    cert_html = " &nbsp;·&nbsp; ".join(esc(c["name"]) for c in resume["certifications"])

    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Jackie Jin — Résumé</title>
<style>
  :root {{
    --ink:#141413; --muted:#3d3b36; --subtle:#6d685f;
    --coral:#cc785c; --rule:#e2d9ca; --chip:#f4eee3; --paper:#ffffff;
  }}
  @page {{ size: A4; margin: 13mm 15mm; }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin:0; padding:0; }}
  body {{
    background: var(--paper); color: var(--ink);
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 10.3px; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}
  a {{ color: var(--coral); text-decoration: none; }}
  .serif {{ font-family: Georgia, "Iowan Old Style", "Times New Roman", serif; }}
  header {{ margin-bottom: 10px; }}
  .name {{ font-family: Georgia, "Times New Roman", serif; font-weight: 600; font-size: 27px;
           letter-spacing: -0.01em; color: var(--ink); }}
  .title {{ color: var(--coral); font-size: 12px; font-weight: 600; margin-top: 1px; letter-spacing: .01em; }}
  .contact {{ color: var(--subtle); font-size: 9.4px; margin-top: 5px; }}
  .rule {{ height: 2px; background: var(--coral); border: 0; margin: 9px 0 0; opacity: .85; }}
  section {{ margin-top: 13px; }}
  h2 {{ font-family: Georgia, "Times New Roman", serif; font-weight: 600; font-size: 12.5px;
        color: var(--ink); margin: 0 0 6px; padding-bottom: 3px; border-bottom: 1px solid var(--rule);
        letter-spacing: .01em; }}
  .summary {{ color: var(--muted); }}
  .skill-row {{ display: flex; gap: 8px; margin-bottom: 3px; }}
  .skill-label {{ flex: 0 0 96px; color: var(--coral); font-weight: 600; }}
  .skill-vals {{ flex: 1; color: var(--muted); }}
  .entry {{ margin-bottom: 8px; page-break-inside: avoid; }}
  .entry-head {{ display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }}
  .entry-org {{ font-weight: 700; font-size: 11px; color: var(--ink); }}
  .entry-date {{ color: var(--subtle); font-size: 9.2px; white-space: nowrap; }}
  .entry-sub {{ color: var(--coral); font-size: 9.8px; font-weight: 600; margin: 0 0 2px; }}
  .proj-tagline {{ color: var(--muted); font-style: italic; margin: 1px 0 2px; }}
  ul {{ margin: 3px 0 0; padding-left: 15px; }}
  li {{ margin-bottom: 1.5px; color: var(--muted); }}
  .impact {{ color: var(--muted); margin-top: 3px; }}
  .impact b {{ color: var(--ink); }}
  .tech {{ margin-top: 4px; display: flex; flex-wrap: wrap; gap: 3px; }}
  .chip {{ background: var(--chip); color: var(--subtle); border: 1px solid var(--rule);
           border-radius: 4px; padding: 0.5px 5px; font-size: 8.5px; }}
  .other-item {{ color: var(--muted); margin-bottom: 2px; }}
  .other-item b {{ color: var(--ink); }}
  .subhead {{ font-weight: 700; color: var(--ink); font-size: 10px; text-transform: uppercase;
              letter-spacing: .06em; margin: 8px 0 4px; }}
  .certs {{ color: var(--muted); margin-top: 4px; }}
</style></head>
<body>
  <header>
    <div class="name">{esc(p['name'])}</div>
    <div class="title">{esc(p['title'])}</div>
    <div class="contact">{contact}</div>
    <hr class="rule">
  </header>

  <section>
    <h2>Summary</h2>
    <div class="summary">{esc(p['bio'])}</div>
  </section>

  <section>
    <h2>Skills</h2>
    {skill_rows}
  </section>

  <section>
    <h2>Experience</h2>
    {exp_html}
  </section>

  <section>
    <h2>AI Engineer Projects</h2>
    {ai_html}
  </section>

  <section>
    <h2>Selected Fullstack Projects</h2>
    {fs_html}
    <div class="subhead">Other Projects</div>
    {other_html}
  </section>

  <section>
    <h2>Education &amp; Certifications</h2>
    {edu_html}
    <div class="certs">{cert_html}</div>
  </section>
</body></html>"""


def main() -> int:
    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(render(), encoding="utf-8")
    print(f"[build_resume_pdf] wrote {OUT_HTML.relative_to(ROOT)}")
    print("[build_resume_pdf] now render to PDF with Chrome headless (see CLAUDE.md).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
