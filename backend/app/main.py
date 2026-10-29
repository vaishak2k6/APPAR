"""APAAR-Satya API (prototype).

Run:  uvicorn app.main:app --reload --port 8000
Docs: http://localhost:8000/docs

State is in memory for now. Swap `app.state` stores for PostgreSQL repositories (see docs/REMAINING_WORK.md).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router
from app.core.config import settings
from app.services.audit_log import AuditLog
from app.services.seat_ledger import SeatLedger

app = FastAPI(title="APAAR-Satya API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo seed: Kaveri College of Engineering, CSE.
ledger = SeatLedger()
ledger.mint("CSE", "Regular", 1, 108)
ledger.mint("CSE", "NRI", 1, 12)
ledger.mint("CSE", "OCI/FN", 1, 6)
ledger.mint("ECE", "Regular", 1, 54)
app.state.ledger = ledger
app.state.audit = AuditLog()
app.state.index: dict[str, str] = {}  # blind index -> institution id

app.include_router(router, prefix="/api/v1")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
