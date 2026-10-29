# STATUS — AI Meal Planning Guide

## What was built

A beginner-friendly manual for using free AI tools to plan weekly meals, published as both Markdown docs and a static HTML site.

**Project structure**
- `LICENSE` — MIT License, copyright line exactly `Copyright (c) 2026 Asdale Dynamics, LLC`
- `README.md` — project overview crediting Asdale Dynamics, LLC and Dylan Asdale
- `docs/` — 9-section beginner manual in Markdown:
  - `00-introduction.md` — overview, who it's for, medical disclaimer
  - `01-getting-started-free-ai.md` — picking a free AI tool, first chat
  - `02-pantry-to-menu.md` — pantry-first weekly menu planning
  - `03-grocery-lists.md` — store-sectioned grocery lists, cost estimates
  - `04-dietary-restrictions.md` — gluten-free, dairy-free, vegetarian, diabetes-friendly, low-energy
  - `05-budget-recipes.md` — cheap staples, stretching ingredients, leftovers
  - `06-step-by-step-prompts.md` — 8 copy-and-paste prompts plus revision lines
  - `07-printable-templates.md` — weekly planner, pantry inventory, grocery list, budget tracker
  - `08-privacy-rules.md` — what never to share with an AI
  - `09-faq-glossary.md` — FAQ and plain-English terms
  - `index.md` — contents and quick links
- `site/` — self-contained static HTML version (no build step, no server):
  - `index.html` + `01-...html` through `09-...html` — one page per manual section
  - `css/style.css` — responsive styles with print media queries
  - `js/site.js` — active-nav highlighting and copy-to-clipboard buttons on prompts
  - `templates/weekly-meal-plan.html` — printer-friendly weekly planner + pantry + grocery + budget tracker
  - `templates/grocery-list.html` — printer-friendly sectioned grocery list
- `tests/verify.js` — Node verification script (file existence, LICENSE text, README credit, secret scanning, HTML/Markdown link integrity)
- Git initialized, one commit (`361f2cb`), working tree clean. Nothing pushed, no remote created.

## How to run it

- **Read the manual:** open any `docs/*.md` file in a text editor or Markdown viewer, or `docs/index.md` for the table of contents.
- **Use the HTML site:** open `site/index.html` in any web browser. Navigate sections with the top menu. Click "Copy" on any `pre code` block to copy a prompt to the clipboard.
- **Print templates:** open `site/templates/weekly-meal-plan.html` or `site/templates/grocery-list.html` in a browser and press Ctrl+P / Cmd+P. Print styles hide headers/footers.
- **No installation, no account, no API key, no build step required.**

## Verification results

Ran `node tests/verify.js` — result: **✔ All checks passed. No errors, no warnings.**

Checks performed:
- All required files exist (LICENSE, README.md, 10 docs, 10 site pages, CSS, JS, 2 templates)
- LICENSE contains exact line `Copyright (c) 2026 Asdale Dynamics, LLC`
- README.md credits Asdale Dynamics, LLC
- No `.github/workflows` directory present
- No secrets, API keys, or private-key patterns detected in scanned files
- All `href` links in HTML files resolve to existing files
- All Markdown links in docs resolve to existing files
- Printable template files present

An initial link issue in `docs/index.md` (paths prefixed with `docs/` from inside the docs folder) was fixed to use `../`-relative paths; verification re-run passed cleanly.

## Known gaps

- The HTML site is a static mirror of the Markdown docs; if the docs are edited, the HTML pages must be updated by hand (no build pipeline).
- No automated spellcheck or HTML validation step beyond the link/structure verifier.
- Cost estimates in budget examples are illustrative; actual grocery prices vary by store and region.
- AI-generated recipes are not tested against real cooking; users should double-check cooking times and food safety (poultry to 165°F / 74°C).
- This guide is education only, not medical advice or nutrition counseling.

## Commit

One commit on branch `master` (root commit `361f2cb`), plain message, no Co-authored-by trailer, not pushed, no remote.
