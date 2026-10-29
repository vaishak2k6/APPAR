# API contract (v1)

Base URL: `http://localhost:8000/api/v1`. All responses are JSON. ✅ = implemented in `backend/app/api/__init__.py`, ⏳ = to build.

## Submissions

| Method | Path | Status | Purpose |
|---|---|---|---|
| POST | `/uploads/validate` | ✅ | Validate a batch: format, duplicate (blind index), NRI evidence, allotment, seat cap. Accepted rows consume seats. |
| POST | `/uploads/{batch_id}/submit` | ⏳ | Maker sends batch to checker |
| POST | `/uploads/{batch_id}/sign` | ⏳ | Checker signs (eSign / DSC mock); triggers student notifications |
| GET | `/institutions/{id}/ledger` | ⏳ | Seat ledger rows for an institution |

`POST /uploads/validate` request:

```json
{
  "institution_id": "kce-mysuru",
  "rows": [
    { "row": 1, "name": "Ananya Raghavan", "apaar_id": "123456784821", "dob": "2008-03-14",
      "branch": "CSE", "quota": "Regular", "year": 1, "allotment_id": "KCET26-0091827" }
  ]
}
```

Response:

```json
{ "accepted": [1], "issues": [ { "row": 7, "level": "error", "code": "R-402", "rule": "RULE-NRI-02", "message": "NRI quota without NRI status evidence." } ] }
```

## Monitoring (AICTE)

| Method | Path | Status | Purpose |
|---|---|---|---|
| GET | `/overview` | ⏳ | National KPIs, state table, source match rates |
| GET | `/institutions?state=&risk=&status=` | ⏳ | Institution list |
| GET | `/institutions/{id}` | ⏳ | Detail incl. flags and score distribution |
| GET | `/review-cases?category=` | ⏳ | Review queue |
| POST | `/review-cases/{id}/decision` | ⏳ | `{ decision: "verified" \| "rejected" \| "evidence", note }` |
| GET | `/fraud-rings` | ⏳ | Detected clusters with nodes/edges |
| GET | `/policy/rules` · POST `/policy/simulate` | ⏳ | Rule register; simulate a parameter change |
| POST | `/score` | ✅ | Compute Truth Score from source results |
| GET | `/audit` | ✅ | Last 50 entries + chain integrity |

## Students and verifiers

| Method | Path | Status | Purpose |
|---|---|---|---|
| GET | `/me/record` | ⏳ | Student's enrolment, source checks, documents |
| POST | `/me/confirm` | ⏳ | `{ answer: "yes" \| "no" }` with OTP |
| POST | `/me/consents/{id}/revoke` | ⏳ | Revoke a verifier's access |
| GET | `/verify/{credential_id}` | ✅ (mock) | Verify a credential, return disclosed claims only |

Reason codes and rule IDs are listed in `frontend/src/lib/data.ts` (`REASONS`, `POLICY_RULES`). Keep backend and frontend codes identical.
