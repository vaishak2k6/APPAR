from app.services.audit_log import AuditLog, merkle_root
from app.services.blind_index import blind_index, mask
from app.services.name_match import is_probable_duplicate, normalise_name
from app.services.seat_ledger import SeatLedger
from app.services.truth_score import truth_score

KEY = b"test-key"


def test_blind_index_is_stable_and_keyed():
    a = blind_index("1234 5678 9012", KEY)
    assert a == blind_index("123456789012", KEY)
    assert a != blind_index("123456789012", b"other-key")
    assert mask("123456789012") == "XXXX XXXX 9012"


def test_seat_ledger_blocks_the_61st_admission():
    ledger = SeatLedger()
    ledger.mint("CSE", "Regular", 1, 60)
    results = [ledger.try_consume("CSE", "Regular", 1) for _ in range(61)]
    assert all(r.ok for r in results[:60])
    assert not results[60].ok and results[60].reason == "R-501"
    ledger.release("CSE", "Regular", 1)
    assert ledger.try_consume("CSE", "Regular", 1).ok


def test_truth_score_requires_three_agreeing_sources():
    verified = truth_score({"institution": "match", "counselling": "match", "digilocker": "match", "student": "match", "scholarship": "na", "abc": "pending"})
    assert verified.status == "Verified"
    weak = truth_score({"institution": "match", "counselling": "na", "digilocker": "na", "student": "pending", "scholarship": "na", "abc": "pending"})
    assert weak.status != "Verified"
    flagged = truth_score({"institution": "match", "counselling": "match", "digilocker": "match", "student": "match", "scholarship": "na", "abc": "na"}, high_severity_flags=1)
    assert flagged.status == "Flagged"


def test_audit_chain_detects_tampering():
    log = AuditLog()
    for i in range(5):
        log.append("tester", "ACTION", f"entity-{i}")
    assert log.verify()
    log.entries[2].entity = "edited"
    assert not log.verify()
    assert len(merkle_root([e.hash for e in log.entries])) == 64


def test_indian_name_variants_match():
    assert normalise_name("Mohd. Irfan Shaikh") == normalise_name("Mohammed Irfan Shaikh")
    dup, score = is_probable_duplicate("Md Irfan Shaikh", "2008-01-04", "Mohammed Irfan Shaikh", "2008-01-04")
    assert dup and score >= 0.88
    assert not is_probable_duplicate("Irfan Shaikh", "2008-01-04", "Irfan Shaikh", "2007-01-04")[0]
