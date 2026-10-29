# APAAR-Satya: slide copy

Final deck: `APAAR-Satya_SIH2026_Final.pptx` (upload `APAAR-Satya_SIH2026_Final.pdf`).
Rebuild with `python work/build_human.py`, or edit the boxes directly in PowerPoint.

**Style (matches the FDR deck):**
- Times New Roman throughout, labels in dark red-brown `#953735`.
- Bullets are PowerPoint's own Wingdings glyphs (❖ ✓ ➢), not typed symbols.
- Pastel gradient boxes (peach, lilac, cyan, green), with white oval labels sitting on the box edge.
- No monospace text, code snippets, badges or status pills: those read as machine-made.

## 1. Title page
- Problem Statement ID – SIH26___ (fill in)
- Problem Statement Title- APAAR ID-Based Student Data Management and Verification Platform
- Theme- Smart Education
- PS Category- Software
- Team ID- ______ (fill in)
- Team Name- TEAM-RESILIENCE

## 2. APAAR-SATYA
*Student Data Management and Verification using APAAR ID*

**Core Issue** (peach) + student-app screenshot on the right
- Only Totals Reach AICTE: Most institutions report total enrolment, not student-level data.
- Excess Admissions: Seats filled beyond approved intake are hard to detect in time.
- Quota Misuse and Ghost Students: NRI / OCI / FN seats and fake entries are difficult to verify.
- Duplicate Enrolment: The same student may hold seats in two colleges.

**Proposed Solution** (lilac)
- APAAR Records: Each admitted student is uploaded with APAAR ID.
- Seat Ledger: Seats issued as per approval; extra uploads are blocked.
- Three-Source Check: A record is verified only when three sources agree.
- Fraud Check: Duplicate APAAR IDs, similar names, shared mobiles.
- Student Confirmation: Students confirm via DigiLocker, SMS or IVR.
- Verifiable Certificates: QR code with APAAR ID and Student ID.

**Novelty** (cyan)
- Truth Score: Counselling, DigiLocker, NSP and ABC data are cross-checked.
- Passive Liveness: No semester credits means a possible ghost student.
- Policy Simulator: AICTE can test a new rule first.
- Submit Once: The same data fills AICTE, AISHE and NIRF reports.
- Fair Review: Dual-degree students are not penalised; colleges can appeal.

## 3. Technical Approach (flowchart)
Top row: Student Data Upload (Excel or API, signed by Principal) → APAAR Validation (ID format and duplicate check) → Seat and Rule Check (approved intake, quota rules) → Multi-Source Verification (counselling, DigiLocker, NSP, ABC) → Central Repository (secure storage with audit trail)

Each green oval heads three boxes:

| Oval | Boxes |
|---|---|
| Seat Ledger | Seats issued from approval · Extra uploads blocked · Quota-wise tracking |
| Duplicate Check | Hashed APAAR matching · Similar name matching · Shared mobile / bank links |
| Student Confirmation | DigiLocker, SMS or IVR · "I did not join" option · Seat surrender request |
| Truth Score | Score from 6 sources · Verified or under review · Reason for every flag |
| Verification | QR on certificates · Shows only what is needed · Student sees access log |

Bottom row:
- **AICTE Dashboard:** Alerts, fill rates, risky institutions and reports.
- **Officer Review and Decision:** Authorised officer checks the evidence and decides.

**Technologies Used:** Next.js, React (frontend) | FastAPI, PostgreSQL (backend) | Python, NetworkX (fraud checks) | Keycloak, HashiCorp Vault (security) | Simulated APAAR, DigiLocker and NSP APIs

## 4. Feasibility and Viability
| | FEASIBILITY | VIABILITY |
|---|---|---|
| Analysis | Buildable with standard web technologies such as Next.js, FastAPI and PostgreSQL. Prototype screens and core checks are already built and tested on synthetic student records. | Low-cost platform for AICTE. Colleges save time because one verified upload fills several reports. |
| Challenges | No direct access to APAAR, counselling and NSP data yet. Spelling differences in Indian names may create false duplicate matches. | Real data access needs government approval. College adoption and DPDP Act compliance are also challenges. |
| Strategies | Use simulated APIs with the real data formats. Normalise common name variants and send doubtful cases for manual review. | Start with one state and its counselling cell. Use role-based access, consent records and audit logs. Free for colleges; paid verification for employers. |

## 5. Impact and Benefits
**Potential Impacts:**
- Accurate Records: AICTE gets student-level data instead of only total numbers.
- Excess Admission Control: Seats beyond approved intake are blocked at upload.
- Scholarship Protection: Scholarships reach only verified students.
- Faster Inspections: Risk-based sampling instead of visiting every college.
- Student Protection: Students can report fake enrolment and surrender seats.
- Better Planning: Real fill-rates help AICTE decide next year's approvals.

**Benefits:**
- Less Paperwork: One verified upload fills AICTE, AISHE and NIRF data.
- Trusted Certificates: Employers verify degrees by scanning a QR code.
- Privacy: Caste, quota and marks are not shown to verifiers.
- Transparency: Every change is saved in a tamper-evident audit log.
- Sustainable Model: Free for students and colleges; employers pay for verification.
- Rural Reach: Students without smartphones confirm by SMS or voice call.

## 6. Research and References
References [1]–[6] in coloured rows (PIB APAAR note 2026, Fellegi–Sunter 1969, Akoglu et al. 2015, AICTE APH 2026–27 + UGC 2022, RFC 6962, W3C VC 2.0 + DPDP Act 2023).

**Solutions Already Exist:**
- AICTE portal collects only total intake.
- AISHE survey collects self-reported statistics.
- DigiLocker and NAD store issued certificates.
- APAAR and ABC give each student an ID.

**Our Solution Stands Out:**
- ONE VERIFIED RECORD: links APAAR, counselling, DigiLocker, NSP, ABC.
- SEAT LEDGER: blocks admissions beyond approved intake at upload.
- STUDENT CONFIRMATION: students confirm or report their own admission.
- EXPLAINABLE FLAGS: every flag shows its reason for officer review.
- PROTOTYPE READY: dashboards and checks shown on synthetic data.

Bottom: 4 app screenshots + green oval with the demo link and GitHub link (fill in).
