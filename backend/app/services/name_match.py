"""Indic-aware name normalisation for near-duplicate detection.

This is a baseline using the standard library. Next steps (see docs/REMAINING_WORK.md):
replace SequenceMatcher with RapidFuzz token-set ratio, add IndicXlit transliteration for names
submitted in Indian scripts, and block candidates by (DOB, state) before comparing.
"""

import re
from difflib import SequenceMatcher

# Common spelling variants seen in Indian admission data.
_VARIANTS = {
    "mohd": "mohammed",
    "md": "mohammed",
    "muhammad": "mohammed",
    "mohammad": "mohammed",
    "mohamed": "mohammed",
    "sri": "shri",
    "shree": "shri",
    "kumaar": "kumar",
}

_HONORIFICS = {"mr", "ms", "mrs", "dr", "kumari", "km", "smt"}


def normalise_name(name: str) -> str:
    tokens = re.sub(r"[^a-z\s]", " ", name.lower()).split()
    out = []
    for t in tokens:
        if t in _HONORIFICS:
            continue
        out.append(_VARIANTS.get(t, t))
    # Initials ("R. Karthik" vs "Karthik Ramesh") carry little signal; keep only full tokens for comparison.
    full = [t for t in out if len(t) > 1]
    return " ".join(sorted(full))


def name_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, normalise_name(a), normalise_name(b)).ratio()


def is_probable_duplicate(a_name: str, a_dob: str, b_name: str, b_dob: str, threshold: float = 0.88) -> tuple[bool, float]:
    if a_dob != b_dob:
        return False, 0.0
    score = name_similarity(a_name, b_name)
    return score >= threshold, round(score, 2)
