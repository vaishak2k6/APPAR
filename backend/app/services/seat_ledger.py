"""Seat Ledger: seats are minted from the Extension of Approval and consumed one record at a time.

Conservation law: for every (branch, quota, year) the number of admitted records can never exceed
the number of minted seats. In production `try_consume` runs inside a SERIALIZABLE Postgres transaction
(or SELECT ... FOR UPDATE on the ledger row) so two concurrent uploads cannot both take the last seat.
"""

from dataclasses import dataclass, field
from threading import Lock


@dataclass
class LedgerRow:
    minted: int
    admitted: int = 0
    blocked_attempts: int = 0


@dataclass
class ConsumeResult:
    ok: bool
    reason: str | None = None
    remaining: int = 0


@dataclass
class SeatLedger:
    rows: dict[tuple[str, str, int], LedgerRow] = field(default_factory=dict)
    _lock: Lock = field(default_factory=Lock, repr=False)

    def mint(self, branch: str, quota: str, year: int, seats: int) -> None:
        self.rows[(branch, quota, year)] = LedgerRow(minted=seats)

    def try_consume(self, branch: str, quota: str, year: int) -> ConsumeResult:
        with self._lock:
            row = self.rows.get((branch, quota, year))
            if row is None:
                return ConsumeResult(False, "R-500")  # no seats minted for this branch/quota
            if row.admitted >= row.minted:
                row.blocked_attempts += 1
                return ConsumeResult(False, "R-501", 0)
            row.admitted += 1
            return ConsumeResult(True, None, row.minted - row.admitted)

    def release(self, branch: str, quota: str, year: int) -> None:
        """Called when a student surrenders a seat or a record is rejected after review."""
        with self._lock:
            row = self.rows[(branch, quota, year)]
            row.admitted = max(0, row.admitted - 1)
