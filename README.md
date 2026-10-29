# APAAR-Satya

APAAR ID-based student data management and verification platform for AICTE-approved institutions.
Smart India Hackathon 2026 · Team Resilience.

> A student counts only when three independent sources agree.

## Repository layout

| Path | What it is |
|---|---|
| `frontend/` | Next.js 15 + TypeScript + Tailwind v4 web app (AICTE console, institution portal, student app, public verifier). Runs on mock data today. |
| `backend/` | FastAPI service. Core integrity engines (seat ledger, blind index, truth score, audit chain, name matching) are implemented and tested; persistence is in-memory. |
| `docs/PROJECT_OUTLINE.md` | Product scope, modules, screens, data model and design rules. |
| `docs/API.md` | API contract the frontend will call. |
| `docs/REMAINING_WORK.md` | Ordered task list to finish the prototype, with ready-to-paste prompts for Antigravity. |
| `docs/ABSTRACT.md`, `docs/SLIDE_COPY.md` | Submission abstract and description, and the text of every slide. |
| `APAAR-Satya_SIH2026_Final.pptx` / `.pdf` | SIH 2026 idea submission deck (official template). |
| `work/` | `build_human.py` rebuilds the deck from `tpl_a.pptx` (needs `python-pptx`, plus Node with `react-icons` and `sharp` for icons). |

## Run it

```bash
# frontend: http://localhost:3000
cd frontend
npm install
npm run dev
```

```bash
# backend: http://localhost:8000/docs
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
python -m pytest -q
```

## Screens

| Route | Who | Purpose |
|---|---|---|
| `/` | Everyone | Sign-in with role selection |
| `/aicte` | AICTE | National overview: KPIs, state table, alerts, risk ranking, source match rates |
| `/aicte/institutions`, `/aicte/institutions/[id]` | AICTE | Institution list and drill-down with seat ledger, flags, score distribution |
| `/aicte/review` | AICTE | Review queue with case panel and decisions |
| `/aicte/fraud-rings` | AICTE | Shared-identifier clusters with graph |
| `/aicte/policy` | AICTE | Rule register (policy-as-code) and policy simulator |
| `/aicte/reports`, `/aicte/audit` | AICTE | Regulatory reports, cross-portal consistency, hash-chained audit log |
| `/institution` | College | Dashboard, seat ledger, issues, pending confirmations |
| `/institution/upload` | College | 5-step submission: upload → map → validate → maker → checker eSign |
| `/institution/students`, `/institution/reports` | College | Records with verification status; auto-filled returns |
| `/student` | Student | Confirm admission, record status, verifiable bonafide, access log with revoke |
| `/verify` | Employer / regulator | Credential check with selective disclosure |
