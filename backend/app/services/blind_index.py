"""Keyed blind index for APAAR IDs.

Raw APAAR IDs are never stored. A 12-digit ID has only 10^12 values, so a plain SHA-256 could be
brute-forced; a secret-keyed HMAC cannot be reversed without the key (kept in Vault / HSM in production).
The index is deliberately NOT salted with the academic year, so a student enrolled in 2025 at one college
and again as a fresher in 2026 at another still produces the same index and is caught.
"""

import hashlib
import hmac
import re

_APAAR_RE = re.compile(r"^\d{12}$")


def normalise_apaar(raw: str) -> str:
    digits = re.sub(r"\D", "", raw or "")
    if not _APAAR_RE.match(digits):
        raise ValueError("APAAR ID must contain exactly 12 digits")
    return digits


def blind_index(apaar_id: str, key: bytes) -> str:
    return hmac.new(key, normalise_apaar(apaar_id).encode(), hashlib.sha256).hexdigest()


def mask(apaar_id: str) -> str:
    d = normalise_apaar(apaar_id)
    return f"XXXX XXXX {d[-4:]}"
