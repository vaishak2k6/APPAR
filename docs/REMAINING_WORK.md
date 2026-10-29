# Remaining work: hand-off for Antigravity

Open the `SIH APPAR` folder in Antigravity. Work top to bottom: each phase builds on the previous one.
Every task has a **prompt** you can paste into the Antigravity agent, plus a **done when** check you verify yourself.

Ground rules to repeat to the agent in every prompt (already included below):
- Keep the existing design system (`frontend/src/app/globals.css`, `frontend/src/components/ui/primitives.tsx`). No gradients, emoji, glassmorphism or new colour palettes.
- Keep reason codes and rule IDs identical between `frontend/src/lib/data.ts` and the backend.
- Never store or log a raw APAAR ID; use `blind_index()` and `mask()`.

---

## Already done (do not redo)

- Project structure, README, outline (`docs/PROJECT_OUTLINE.md`), API contract (`docs/API.md`).
- Frontend UI for every screen on synthetic data: sign-in, AICTE console (overview, institutions, detail, review queue, fraud rings, policy + simulator, reports, audit), institution portal (dashboard, 5-step upload, records, returns), student app, public verifier.
- Backend engines with tests: seat ledger, HMAC blind index, truth score, hash-chained audit log + Merkle root, Indian-name normalisation. Endpoints: `/uploads/validate`, `/score`, `/audit`, `/verify/{id}` (mock).

### Setup notes (read before installing anything)

- Keep **TypeScript on 5.x**. TypeScript 7 breaks Next.js 15 (`Failed to load next.config`). That's why the config is `next.config.mjs`, not `.ts`.
- `npm install` on this network took ~40 minutes the first time. Don't delete `frontend/node_modules`.
- Verified on 29 Oct 2026: `npm run build` passes with 16 routes; `python -m pytest -q` passes 5 tests in `backend/`.

---

## Phase 1: Data foundation (day 1)

### 1.1 PostgreSQL + models
**Prompt:**
> In `backend/`, add SQLAlchemy 2.0 models and Alembic migrations for the schema in `docs/PROJECT_OUTLINE.md` section 5. Add a `docker-compose.yml` at the repo root with Postgres 16 (user/password/db `apaar`/`apaar`/`apaar_satya`). Replace the in-memory `app.state` stores in `backend/app/main.py` with repository classes. `SeatLedger.try_consume` must run in a SERIALIZABLE transaction or use `SELECT ... FOR UPDATE` on the ledger row. Keep all existing tests passing and add one test that runs 2 concurrent consumes on the last seat and asserts only one succeeds.

**Done when:** `docker compose up -d` then `python -m pytest -q` passes, and `/docs` still works.

### 1.2 Synthetic dataset generator
**Prompt:**
> Create `backend/scripts/generate_synthetic.py` that writes 100 institutions and 50,000 students for AY 2026–27 into Postgres, plus mock source tables (counselling allotments, DigiLocker marks, NSP scholarships, ABC credits, student confirmations). Inject these fraud patterns with ground-truth labels in a `labels` table: over-intake uploads, NRI seat without proof, same APAAR at two colleges, near-duplicate names (Mohd/Mohammed, initials), ineligible PCM marks, not in allotment list, 3 rings of 6–14 students sharing a mobile number, ghost students with no ABC credits. Use Indian names from multiple states and fictional college names. Seed with a fixed random seed.

**Done when:** the script runs in under 2 minutes and prints counts per fraud type.

---

## Phase 2: Wire engines to data (day 1–2)

### 2.1 Policy-as-Code evaluator
**Prompt:**
> Implement `backend/app/services/rules.py`: load rules from the `policy_rules` table (JSON-logic format, see `POLICY_RULES` in `frontend/src/lib/data.ts` for the exact shape) using the `json-logic-qubit` package or a small evaluator. Each failure returns `{rule_id, version, reason_code, action}`. Use it inside `/uploads/validate` instead of the hard-coded NRI/allotment checks. Add `GET /api/v1/policy/rules` and `POST /api/v1/policy/simulate` (body `{ "nri_cap_pct": 15 }`, returns institutions over the cap and seats affected).

**Done when:** changing a rule row in the DB changes validation output without a code change.

### 2.2 Triangulation job
**Prompt:**
> Add `backend/app/services/triangulate.py` that, for each enrolment, fills `source_checks` by comparing against the mock source tables, then computes the score with `truth_score()` and opens `flags` + `review_cases` for anything not Verified. Run it after each signed batch and as `python -m app.jobs.triangulate --all`.

### 2.3 Duplicate detection upgrade
**Prompt:**
> In `backend/app/services/name_match.py`, switch to RapidFuzz `token_set_ratio`, block candidate pairs by (dob, state) to keep it fast, and keep the existing tests. Add an exception list for legitimate concurrent enrolment (UGC dual degree, counselling upgrade, transfer in progress) so those are classified, not flagged.

### 2.4 Fraud-ring detection
**Prompt:**
> Add `backend/app/services/fraud_graph.py` using NetworkX: build a bipartite graph of students ↔ shared identifiers (mobile HMAC, bank account HMAC, guardian+address hash), find connected components with more than 3 students, and score confidence by size, number of institutions and missing allotment/confirmation. Expose `GET /api/v1/fraud-rings` returning `{id, link, linkType, students, institutions, confidence, nodes, edges}`.

**Done when:** the 3 injected rings from 1.2 are all detected and the cleared ring (size 4, one institution) scores below 0.5.

### 2.5 Measure detection quality
**Prompt:**
> Create `backend/scripts/evaluate.py` that compares flags against the ground-truth `labels` table and prints precision, recall and F1 per fraud type plus overall false-positive rate, and writes the same to `docs/RESULTS.md`.

**Done when:** you have real numbers to put on the PPT and say in the demo.

---

## Phase 3: Connect the frontend (day 2)

### 3.1 API client
**Prompt:**
> In `frontend/src/lib/api.ts`, add typed fetch functions for every endpoint in `docs/API.md` using `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api/v1`). Replace imports from `lib/data.ts` page by page, starting with `/aicte` and `/institution/upload`. Keep `lib/data.ts` as a fallback when the API is unreachable so the demo never shows a blank screen. Use server components for reads; client components only where there is interaction. Do not change any styling.

### 3.2 Real upload flow
**Prompt:**
> In `frontend/src/app/institution/upload/upload-flow.tsx`, parse the chosen .xlsx/.csv in the browser with SheetJS (`xlsx` package), show the detected headers in step 2, call `POST /uploads/validate` in step 3 and render the returned issues, then call submit and sign endpoints in steps 4–5. Provide `frontend/public/sample/kce_admissions_2026_batch2.xlsx` with 64 rows that triggers the same 4 errors and 3 warnings shown today.

### 3.3 Review decisions + audit
**Prompt:**
> Wire `review-workspace.tsx` to `GET /review-cases` and `POST /review-cases/{id}/decision`. Every decision must append an audit entry. Make the "Verify chain now" button on `/aicte/audit` call `GET /audit` and show Intact / Broken.

---

## Phase 4: Student and verifier (day 2–3)

### 4.1 Confirmation channels (mock)
**Prompt:**
> Add `POST /me/confirm` with a mock OTP (always `123456` in dev) and a notifications table that records DigiLocker push / SMS / IVR attempts. Add a 14-day timer job that moves unconfirmed records to review with reason `R-702`. Wire the buttons in `frontend/src/app/student/student-home.tsx`.

### 4.2 Verifiable credentials
**Prompt:**
> Issue the bonafide certificate as an SD-JWT VC signed with an Ed25519 key (use the `sd-jwt` Python package or implement with `cryptography` + `PyJWT`). Selectively disclosable claims: name, programme, institution, status; always hidden: dob, category, quota, marks, full APAAR. Implement `GET /verify/{credential_id}` for real (signature + revocation check) and replace `components/qr-placeholder.tsx` with a real QR using the `qrcode` npm package that encodes the verify URL.

### 4.3 Consent ledger
**Prompt:**
> Implement consents (grant on share, revoke, expiry) and log every verifier access to the student's access history. Wire the Revoke button.

---

## Phase 5: Polish for judging (day 3)

| Task | Notes |
|---|---|
| Auth + role guard | NextAuth (credentials provider) or a simple signed cookie; protect `/aicte` and `/institution`. Demo users in a seed file, not in chat. |
| Hindi toggle | `next-intl` with `en` and `hi` for the sign-in page, student page and verifier page at minimum. |
| Mobile check | Student page at 375px width; sidebar collapses to a drawer on the console. |
| Loading & empty states | Skeleton rows in tables; empty state when filters return nothing. |
| Error states | API down → fall back to demo data with a small "offline demo data" badge. |
| Demo script | Follow the 7-step demo in the PPT; rehearse to under 6 minutes. |
| Deploy | Frontend on Vercel, backend on Render/Railway with managed Postgres; set `NEXT_PUBLIC_API_URL`. |
| Screenshots in PPT | Replace the PPT slide-3 prototype box with 2 real screenshots once the UI is wired. |

---

## Known gaps in the current UI (fix when wiring data)

- Filters on `/aicte/institutions` and tabs on `/institution/students` are visual only.
- The institution detail page shows the same seat ledger for every institution (demo data).
- The QR code is a visual placeholder (task 4.2).
- Search box in the top bar is not wired.
- `/aicte/reports` "Generate" buttons do not produce files yet (build XLSX with `openpyxl` on the backend).
