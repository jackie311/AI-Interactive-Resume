---
name: export-resume
description: Convert resume.md (or a resume variant) into a styled A4 HTML file and auto-export to PDF using Chrome headless. Supports 4 templates: classic, modern, minimal, sidebar.
user-invocable: true
---

You are Jackie's resume export engine. You read a markdown resume file, convert it to a beautiful, print-ready A4 HTML using a chosen design template, save the HTML, and export a PDF using Chrome headless.

---

## Usage

```
/export-resume                                          # master resume, modern template
/export-resume modern                                   # explicit template
/export-resume sidebar                                  # dark sidebar template
/export-resume classic resume-variants/2026-05-28-anthropic-ai-engineer.md
/export-resume minimal                                  # minimal/typographic
```

**Templates:** `classic` | `modern` (default) | `minimal` | `sidebar`  
**Source:** any `.md` resume file. Defaults to `frontend/public/resume.md`.

---

## Step 1: Parse inputs

- Determine template name (default: `modern`)
- Determine source markdown file (default: `frontend/public/resume.md`)
- Read the source markdown file
- Read the template HTML from `resume-templates/{template}.html`
- Determine output slug from source filename (e.g. `resume` or `2026-05-28-anthropic-ai-engineer`)

---

## Step 2: Parse the markdown into structured data

Parse the resume markdown into these sections. Every field is required — if missing from the markdown, omit that element gracefully.

```
NAME          — top-level H1
CONTACT       — line below H1 (phone | email)
LINKS         — second contact line (linkedin | website)
SUMMARY       — paragraphs under "## Personal Summary"
SKILLS        — structured groups under "## Skills" (each **Group:** header + bullet list)
WORK          — list of jobs under "## Work Experience"
              — each job: company, role, dates, location, bullets, Key Achievements bullets
PROJECTS      — list under "## Project Experience"
              — each project: title, dates, org, url, bullets, Impact bullets, Tech line
CERTS         — items under "Qualifications and Certifications" within Skills section
```

---

## Step 3: Generate HTML body

Generate the resume HTML body using the CSS classes defined in the template.

### For `classic`, `modern`, `minimal` templates — single column body

Use this structure (adapt CSS class names per template, see table below):

```html
<header>
  <div class="resume-name">{NAME}</div>
  <div class="resume-contact">{PHONE} | <a href="mailto:{EMAIL}">{EMAIL}</a></div>
  <div class="resume-links">
    <a href="{LINKEDIN_URL}">{LINKEDIN_TEXT}</a> | <a href="{SITE_URL}">{SITE_TEXT}</a>
  </div>
  <!-- minimal only: add <hr class="header-rule"> here -->
</header>

<section class="section summary">
  <h2 class="section-title">Personal Summary</h2>
  <p>{paragraph 1}</p>
  <p>{paragraph 2}</p>
</section>

<section class="section">
  <h2 class="section-title">Skills</h2>
  <div class="skills-grid">
    <div class="skill-group">
      <div class="skill-group-name">Frontend</div>
      <ul><li>React, Next.js, TypeScript</li>...</ul>
    </div>
    <!-- repeat for each skill group -->
    <!-- Qualifications and Certifications goes here as a skill-group spanning full width if needed -->
  </div>
</section>

<section class="section">
  <h2 class="section-title">Work Experience</h2>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-company">NCS Australia</span>
      <span class="entry-date">Jun 2022 – Present</span>
    </div>
    <div class="entry-role">Senior Software Engineer — Brisbane</div>
    <ul>
      <li>...</li>
    </ul>
    <div class="entry-achievements-title">Key Achievements:</div>
    <ul>
      <li>...</li>
    </ul>
  </div>
  <!-- repeat for each job -->

</section>

<section class="section">
  <h2 class="section-title">Project Experience</h2>

  <div class="entry">
    <div class="entry-header">
      <span class="entry-company">Booking Entity Authorisation Reporting (BEAR)</span>
      <span class="entry-date">Oct 2024 – Mar 2026</span>
    </div>
    <div class="entry-role">Department of Transport and Main Road — Brisbane</div>
    <div class="entry-url"><a href="{URL}">{URL}</a></div>
    <ul>
      <li>...</li>
    </ul>
    <div class="entry-impact-title">Impact:</div>
    <ul>
      <li>...</li>
    </ul>
    <div class="entry-tech">
      <!-- modern/sidebar: use .tag spans for each tech item -->
      <!-- classic/minimal: plain text "Tech: React, Next.js, ..." -->
    </div>
  </div>
  <!-- repeat for each project -->

</section>
```

### For `sidebar` template — two-column layout

The `sidebar.html` template has TWO placeholders: `{{SIDEBAR}}` and `{{MAIN}}`.

**Sidebar content** (goes inside `<aside class="sidebar">`):
```html
<div class="sidebar-name">Jackie Jin</div>
<div class="sidebar-title">AI Engineer · Full Stack</div>

<div class="sidebar-contact">
  <div class="sidebar-contact-item">0406208836</div>
  <div class="sidebar-contact-item"><a href="mailto:qing.jin3912@gmail.com">qing.jin3912@gmail.com</a></div>
  <div class="sidebar-contact-item"><a href="{LINKEDIN}">linkedin.com/in/jackie-qing-jin</a></div>
  <div class="sidebar-contact-item"><a href="{SITE}">profile.jackiejin.dev</a></div>
</div>

<div class="sidebar-section-title">Skills</div>

<div class="skill-category">
  <div class="skill-cat-name">AI Engineering</div>
  <ul>
    <li>RAG Pipelines</li>
    <li>LangChain, LangSmith</li>
    ...
  </ul>
</div>
<!-- one .skill-category per skill group from the markdown -->

<div class="sidebar-section-title">Certifications</div>
<div class="cert-item">AWS Cloud Practitioner</div>
<div class="cert-item">CCNP</div>
<div class="cert-item">MNM — QUT</div>
```

**Main content** (goes inside `<main class="main">`):
```html
<div class="main-header">
  <div class="main-name">Jackie Jin</div>
  <div class="main-tagline">Full Stack Engineer · AI Engineering · 8+ years</div>
  <hr class="main-header-rule">
</div>

<section class="section summary">
  <h2 class="section-title">Summary</h2>
  <p>...</p>
</section>

<section class="section">
  <h2 class="section-title">Work Experience</h2>
  <!-- same .entry structure as above -->
</section>

<section class="section">
  <h2 class="section-title">Projects</h2>
  <!-- same .entry structure as above -->
</section>
```

---

## Step 4: Inject into template

For `classic`, `modern`, `minimal`:
- Replace `{{BODY}}` in the template HTML with the generated body HTML

For `sidebar`:
- Replace `{{SIDEBAR}}` with the sidebar HTML
- Replace `{{MAIN}}` with the main HTML

---

## Step 5: Quality checks before saving

- Verify all section headings are present
- Verify no `{{BODY}}`, `{{SIDEBAR}}`, `{{MAIN}}` placeholders remain in the output
- Verify all links have valid href values
- Verify Tech lines: for `modern`/`sidebar` use `.tag` spans; for `classic`/`minimal` use plain italic text
- Verify dates are in the format "Mon YYYY – Mon YYYY" (e.g. "Jun 2022 – Present")

---

## Step 6: Determine output filenames

```
source file: frontend/public/resume.md       → slug = "resume"
source file: resume-variants/2026-05-28-anthropic-ai-engineer.md  → slug = "2026-05-28-anthropic-ai-engineer"

html output: resume-exports/{slug}-{template}.html
pdf output:  resume-exports/{slug}-{template}.pdf
```

---

## Step 7: Save the HTML file

Write the complete HTML to `resume-exports/{slug}-{template}.html`.

---

## Step 8: Export PDF using Chrome headless

Run the following command to convert HTML to PDF:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="D:/Jackie/repo/myResume/resume-exports/{slug}-{template}.pdf" \
  "file:///D:/Jackie/repo/myResume/resume-exports/{slug}-{template}.html"
```

**Important:** Use the absolute Windows path with forward slashes for the `file:///` URL.

If Chrome exits with code 0: PDF export succeeded.

If Chrome exits with a non-zero code or is not found:
1. Try the path `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`
2. If still failing, inform the user: "Open `resume-exports/{slug}-{template}.html` in Chrome → Ctrl+P → Save as PDF → A4, no margins"

---

## Step 9: Report to user

```
## Export Complete

**Source:**   {source path}
**Template:** {template name}
**HTML:**     resume-exports/{slug}-{template}.html
**PDF:**      resume-exports/{slug}-{template}.pdf  ✅ (or ❌ see fallback instructions)

### Preview tips
- Open the HTML in Chrome for a live preview before printing
- To switch templates, run: /export-resume {other-template} {source-path}
- To tailor for a JD first, run: /tailor-resume <jd>  then  /export-resume {template} resume-variants/...

### Available templates
| Name     | Style                          | Best for                        |
|----------|--------------------------------|---------------------------------|
| modern   | Blue accents, clean sans-serif | Tech startups, SaaS, AI roles   |
| sidebar  | Dark sidebar, two-column       | AI/ML, senior eng, standout     |
| classic  | Serif, traditional B&W         | Enterprise, government, finance |
| minimal  | Ultra-clean, typographic       | Design-adjacent, creative tech  |
```

---

## Formatting rules

- Never truncate content — all jobs and projects must appear in the output
- No placeholder text or lorem ipsum
- All URLs from the markdown must be preserved as working `<a>` links
- Do not add skills, jobs, or content not in the source markdown
- Dates: if the markdown has "Jun 2022 - Present" preserve exactly; clean up spacing if needed
- The `entry-tech` line: parse the **Tech:** line at the bottom of each project, split by comma, generate `<span class="tag">` for modern/sidebar or `<em>Tech: ...</em>` for classic/minimal
- Page breaks: use `page-break-inside: avoid` (already in templates) — do NOT add manual `<div style="page-break-before: always">`
- For the **Qualifications and Certifications** subsection in the Skills section: render it as a regular `skill-group` in the skills grid for single-column templates; in sidebar template, move it to the sidebar as the Certifications block
