"""Triangulated Truth Score.

Each record is compared against independent sources. A record is Verified when at least
three sources agree with the institution's upload (the upload itself counts as one).
Weights are a starting point; tune them on the synthetic dataset and report precision/recall.
"""

from dataclasses import dataclass
from typing import Literal

Result = Literal["match", "mismatch", "pending", "na"]

WEIGHTS: dict[str, int] = {
    "institution": 10,
    "counselling": 25,
    "digilocker": 15,
    "student": 25,
    "scholarship": 10,
    "abc": 15,
}


@dataclass
class Score:
    value: int
    status: Literal["Verified", "Provisional", "Under review", "Flagged"]
    agreeing_sources: int


def truth_score(sources: dict[str, Result], high_severity_flags: int = 0) -> Score:
    applicable = {k: v for k, v in sources.items() if v != "na"}
    total_weight = sum(WEIGHTS[k] for k in applicable) or 1
    earned = sum(WEIGHTS[k] for k, v in applicable.items() if v == "match")
    lost = sum(WEIGHTS[k] for k, v in applicable.items() if v == "mismatch")
    value = round(100 * (earned - 0.5 * lost) / total_weight)
    value = max(0, min(100, value - 15 * high_severity_flags))
    agreeing = sum(1 for v in applicable.values() if v == "match")

    if high_severity_flags or value < 50:
        status = "Flagged"
    elif agreeing >= 3 and value >= 80:
        status = "Verified"
    elif any(v == "mismatch" for v in applicable.values()):
        status = "Under review"
    else:
        status = "Provisional"
    return Score(value, status, agreeing)
