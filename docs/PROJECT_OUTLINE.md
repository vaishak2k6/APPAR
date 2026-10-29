# APAAR-Satya: project outline

## 1. Problem (from the SIH problem statement)

AICTE receives mostly institution-level totals, not verifiable student-level records. That allows over-admission beyond approved intake, quota misuse (NRI / OCI / FN), ghost students, duplicate enrolment across colleges, and inconsistent numbers across AICTE, AISHE and NIRF.

## 2. Solution in one paragraph

Institutions submit admitted-student records keyed by APAAR ID. Every record must consume a seat minted from the Extension of Approval (hard cap), passes machine-readable handbook rules, and is then cross-checked against independent sources: counselling allotment, DigiLocker marksheets, the student's own confirmation, NSP scholarship data and ABC credit activity. A record is **Verified** only when three or more sources agree. Everything else goes to a human review queue with reason codes. All changes are written to a hash-chained audit log, and students get verifiable credentials with selective disclosure.

## 3. Users and their screens

| User | Goal | Screens |
|---|---|---|
| AICTE officer | Monitor compliance, act on risk | Overview, Institutions, Institution detail, Review queue, Fraud rings, Policy rules + simulator, Reports, Audit log |
| Institution maker | Submit records cleanly | Dashboard, Submit records (5 steps), Student records, Reports & returns |
| Institution checker (Registrar / Principal) | Sign batches | Step 5 of Submit records (eSign / DSC) |
| Student | Confirm admission, control data | Student home: confirm / dispute, record status, documents, access log |
| Verifier (employer, bank, regulator) | Check a credential | Public verify page |

## 4. Modules and where they live

| Module | Backend | Frontend |
|---|---|---|
| Seat Ledger (intake cap) | `services/seat_ledger.py` ✅ | `components/seat-ledger.tsx` ✅ |
| Policy-as-Code rules | rule register ⏳ (JSON-logic evaluator to build) | `/aicte/policy` ✅ |
| Truth Score (triangulation) | `services/truth_score.py` ✅ | score chips, source cells ✅ |
| Duplicate detection | `services/blind_index.py` ✅, `services/name_match.py` ✅ baseline | review queue ✅ |
| Fraud-ring graph | ⏳ NetworkX job | `/aicte/fraud-rings` ✅ |
| Student voice (confirm / dispute / surrender) | ⏳ endpoints + SMS/IVR mock | `/student` ✅ |
| File once (AISHE / NIRF / NAAC) | ⏳ report generators | `/aicte/reports`, `/institution/reports` ✅ |
| Verifiable credentials | ⏳ SD-JWT issuer/verifier | `/student`, `/verify` ✅ |
| Audit chain + daily anchor | `services/audit_log.py` ✅ | `/aicte/audit` ✅ |

✅ done · ⏳ remaining (see `REMAINING_WORK.md`)

## 5. Core data model (target PostgreSQL schema)

```
institutions(id, aicte_id, name, city, state, type, created_at)
seat_ledger(id, institution_id, academic_year, branch, quota, year_of_study, minted, admitted, blocked_attempts)
students(id, apaar_hmac, apaar_last4, name, dob, gender, category_enc, mobile_hmac, created_at)
enrolments(id, student_id, institution_id, academic_year, branch, quota, year_of_study, allotment_id, status, truth_score, batch_id)
source_checks(id, enrolment_id, source, result, checked_at, evidence_ref)
flags(id, enrolment_id, reason_code, rule_id, rule_version, severity, opened_at, closed_at)
review_cases(id, enrolment_id, priority, assignee_id, decision, note, decided_at)
batches(id, institution_id, maker_id, checker_id, row_count, file_sha256, signed_at, signature_type)
policy_rules(id, version, category, expression_json, status, approved_by)
consents(id, student_id, grantee, purpose, granted_at, expires_at, revoked_at)
credentials(id, student_id, type, sd_jwt, issued_at, revoked_at)
audit_entries(seq, time, actor, action, entity, prev_hash, hash)
```

Sensitive fields (category, mobile, DOB) are encrypted or HMAC-indexed. Raw APAAR IDs are never stored.

## 6. Design rules (keep the product looking like a real government system)

- **Type:** IBM Plex Sans for text, IBM Plex Mono for IDs, hashes and codes. 13–14px body, 22px page titles.
- **Colour:** institutional navy (`navy-700 #1D4E89`) for actions and navigation. Saffron only for small emphasis. Status colours (emerald / amber / red) only for status.
- **Surfaces:** white panels with 1px `#DADFE6` borders and 4–6px radius on a `#F3F4F6` canvas. No gradients, glows, glassmorphism, emoji or illustrations.
- **Data first:** dense tables with uppercase 11px headers, tabular numerals, Indian digit grouping (21,48,630), right-aligned numbers.
- **Language:** plain, specific, official tone. Say what happened and what to do ("Attach NRI proof or change quota"), never marketing copy.
- **Trust cues:** government identity strip, breadcrumbs, "as of" timestamps, rule IDs on every flag, masked APAAR IDs (XXXX XXXX 1234), audit references.
- **Accessibility:** visible focus rings, text-size controls, Hindi toggle placeholder, colour never the only signal (badges carry text).

Tokens live in `frontend/src/app/globals.css`; shared components in `frontend/src/components/ui/`.
