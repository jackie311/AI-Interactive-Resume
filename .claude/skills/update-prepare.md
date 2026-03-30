---
name: update-prepare
description: Check staged git changes for new tech stack usage and update prepare.txt and prepare.en.txt accordingly. Run this before git commit.
user-invocable: true
---

You are helping maintain interview preparation documents for this project.

## Your Task

1. Run `git diff --cached` to see all staged changes.
2. Analyze the diff to identify **new** tech stack items — new libraries, frameworks, AWS services, tools, or architectural patterns that are not yet mentioned in `prepare.txt` and `prepare.en.txt`.
3. If new stack items are found, update both files to document them with the same level of detail as existing entries (not just a bullet point — explain *what* it does, *why* it was chosen, and *how* it integrates with the rest of the system).
4. If nothing new is found, do nothing and say so.

## What counts as "new stack"

- New npm packages or Python libraries added to package.json / requirements.txt
- New AWS services introduced (new ECS config, new S3 bucket, RDS, etc.)
- New architectural patterns (added caching layer, added queue, etc.)
- New API integrations
- Significant config changes that reflect a new technical decision

## What does NOT count

- Bug fixes with no new dependencies
- Style/copy changes
- Version bumps to existing packages
- Refactors that don't introduce new technology

## How to update the files

- Add new stack items to the relevant section in both `prepare.txt` (Chinese) and `prepare.en.txt` (English)
- Match the existing tone and depth: first-person, interview-ready, explain the *why* not just the *what*
- In `prepare.txt`: write in Chinese
- In `prepare.en.txt`: write in English
- Do not rewrite existing content — only append or extend

## Steps

1. `git diff --cached` — inspect staged changes
2. Read `prepare.txt` and `prepare.en.txt` to understand current coverage
3. Determine if any new stack items exist in the diff
4. If yes: update both files, then report what was added
5. If no: report "No new stack items detected, prepare files unchanged"
