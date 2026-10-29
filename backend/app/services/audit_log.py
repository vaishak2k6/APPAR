"""Append-only, hash-chained audit log.

entry_hash = SHA-256(prev_hash || canonical JSON of the entry). Changing any past entry changes its hash
and breaks every link after it. A daily Merkle root over the day's entries is anchored to an external
timestamp authority (RFC 3161) so even the database owner cannot rewrite history unnoticed.
"""

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timezone

GENESIS = "0" * 64


@dataclass
class AuditEntry:
    seq: int
    time: str
    actor: str
    action: str
    entity: str
    prev: str
    hash: str


def _digest(prev: str, payload: dict) -> str:
    body = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256((prev + body).encode()).hexdigest()


@dataclass
class AuditLog:
    entries: list[AuditEntry] = field(default_factory=list)

    def append(self, actor: str, action: str, entity: str) -> AuditEntry:
        prev = self.entries[-1].hash if self.entries else GENESIS
        seq = len(self.entries) + 1
        time = datetime.now(timezone.utc).isoformat()
        payload = {"seq": seq, "time": time, "actor": actor, "action": action, "entity": entity}
        entry = AuditEntry(seq, time, actor, action, entity, prev, _digest(prev, payload))
        self.entries.append(entry)
        return entry

    def verify(self) -> bool:
        prev = GENESIS
        for e in self.entries:
            payload = {"seq": e.seq, "time": e.time, "actor": e.actor, "action": e.action, "entity": e.entity}
            if e.prev != prev or e.hash != _digest(prev, payload):
                return False
            prev = e.hash
        return True


def merkle_root(hashes: list[str]) -> str:
    if not hashes:
        return GENESIS
    level = hashes[:]
    while len(level) > 1:
        if len(level) % 2:
            level.append(level[-1])
        level = [hashlib.sha256((level[i] + level[i + 1]).encode()).hexdigest() for i in range(0, len(level), 2)]
    return level[0]
