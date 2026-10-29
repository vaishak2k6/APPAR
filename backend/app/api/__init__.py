"""HTTP routes. Contracts match docs/API.md; the frontend's lib/data.ts mirrors these shapes."""

from typing import Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.blind_index import blind_index, mask
from app.services.truth_score import truth_score

router = APIRouter()

Quota = Literal["Regular", "TFWS", "EWS", "NRI", "OCI/FN", "Lateral Entry"]


class StudentRow(BaseModel):
    row: int
    name: str
    apaar_id: str | None = None
    dob: str
    branch: str
    quota: Quota
    year: int = 1
    allotment_id: str | None = None
    nri_evidence: bool = False


class UploadBatch(BaseModel):
    institution_id: str = Field(examples=["kce-mysuru"])
    rows: list[StudentRow]


class Issue(BaseModel):
    row: int
    level: Literal["error", "warning"]
    code: str
    rule: str
    message: str


class ValidationResult(BaseModel):
    accepted: list[int]
    issues: list[Issue]


@router.post("/uploads/validate", response_model=ValidationResult)
def validate_batch(batch: UploadBatch, request: Request) -> ValidationResult:
    """Run format, quota, intake and duplicate checks on a batch. Accepted rows consume seats."""
    ledger = request.app.state.ledger
    index: dict[str, str] = request.app.state.index
    audit = request.app.state.audit
    issues: list[Issue] = []
    accepted: list[int] = []

    for r in batch.rows:
        if not r.apaar_id:
            issues.append(Issue(row=r.row, level="error", code="F-010", rule="FORMAT-APAAR", message="APAAR ID missing; request generation via ABC."))
            continue
        try:
            key = blind_index(r.apaar_id, settings.blind_index_key)
        except ValueError as e:
            issues.append(Issue(row=r.row, level="error", code="F-011", rule="FORMAT-APAAR", message=str(e)))
            continue
        if key in index and index[key] != batch.institution_id:
            issues.append(Issue(row=r.row, level="error", code="R-204", rule="RULE-DUP-04", message="APAAR ID already active at another institution."))
            continue
        if r.quota == "NRI" and not r.nri_evidence:
            issues.append(Issue(row=r.row, level="error", code="R-402", rule="RULE-NRI-02", message="NRI quota without NRI status evidence."))
            continue
        if r.quota == "Regular" and not r.allotment_id:
            issues.append(Issue(row=r.row, level="warning", code="R-101", rule="MATCH-ALLOT", message="No counselling allotment ID supplied."))
        seat = ledger.try_consume(r.branch, r.quota, r.year)
        if not seat.ok:
            issues.append(Issue(row=r.row, level="error", code=seat.reason or "R-501", rule="RULE-INTAKE-01", message=f"No seat available for {r.branch} / {r.quota}."))
            audit.append("system", "UPLOAD_REJECTED", f"{batch.institution_id} row {r.row} ({mask(r.apaar_id)})")
            continue
        index[key] = batch.institution_id
        accepted.append(r.row)

    audit.append(batch.institution_id, "BATCH_VALIDATED", f"{len(accepted)} accepted, {len(issues)} issues")
    return ValidationResult(accepted=accepted, issues=issues)


class ScoreRequest(BaseModel):
    sources: dict[str, Literal["match", "mismatch", "pending", "na"]]
    high_severity_flags: int = 0


@router.post("/score")
def score(req: ScoreRequest) -> dict:
    s = truth_score(req.sources, req.high_severity_flags)
    return {"value": s.value, "status": s.status, "agreeing_sources": s.agreeing_sources}


@router.get("/audit")
def audit_log(request: Request) -> dict:
    log = request.app.state.audit
    return {"intact": log.verify(), "entries": [e.__dict__ for e in log.entries[-50:]]}


@router.get("/verify/{credential_id}")
def verify_credential(credential_id: str) -> dict:
    # TODO: look up the issued SD-JWT / W3C VC, check issuer signatures and revocation status.
    if credential_id.upper() != "VC-2026-KCE-004821":
        raise HTTPException(status_code=404, detail="No valid credential found")
    return {
        "valid": True,
        "issued": "2026-10-27",
        "disclosed": {
            "name": "Ananya Raghavan",
            "programme": "B.E. Computer Science & Engineering",
            "institution": "Kaveri College of Engineering, Mysuru",
            "status": "Enrolled, first year, 2026-27",
        },
        "withheld": ["date_of_birth", "category", "quota", "marks", "apaar_id"],
    }
