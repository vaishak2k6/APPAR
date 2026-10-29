# APAAR-Satya: abstract and description

**Title:** APAAR-Satya: Student Data Management and Verification Platform using APAAR ID

## Abstract (about 170 words)

AICTE mostly receives total enrolment numbers from approved institutions, not the details of each student. Because of this, it is hard to find out if a college has admitted more students than its approved intake, filled NRI or foreign national seats with domestic students, added ghost students, or if the same student is holding seats in two colleges.

APAAR-Satya is a web platform where institutions upload admitted student records using the APAAR ID. Every upload is checked against the seats approved for that college, so extra admissions are blocked at the time of upload. Each record is then cross-checked with other sources: the counselling allotment list, DigiLocker marksheets, the student's own confirmation, scholarship data and academic credits in ABC. A student is marked verified only when at least three sources agree. Doubtful records go to an AICTE officer with the reason clearly shown.

AICTE gets a live dashboard and reliable reports. Colleges can reuse the same data for AISHE and NIRF. Students get a verifiable certificate with their APAAR ID that employers can check by scanning a QR code.

## Description (about 480 words)

### Problem
At present, most AICTE-approved institutions share only statistical data such as total enrolment during the approval process. Student-level data comes only from PGDM institutions. This makes it difficult for AICTE to:
- detect admissions beyond the approved intake,
- check NRI, OCI and foreign national seats,
- find fake or duplicate student entries, and
- trust that the numbers sent to AICTE, AISHE and NIRF are the same.

### Proposed solution
APAAR-Satya uses the APAAR ID as the single identity of a student across all AICTE institutions.

1. **Student data upload.** Colleges upload student records through an Excel file or an API. The admission officer prepares the batch and the Principal or Registrar signs it using eSign or a digital signature.
2. **Seat Ledger.** Seats approved in the Extension of Approval are recorded branch-wise and quota-wise. If a college tries to upload more students than its approved seats, the extra records are rejected immediately.
3. **Validation.** The system checks for missing or wrong APAAR IDs, duplicate students within and across colleges, eligibility marks, and quota rules. Every rejected record shows the rule that caused it, so the college knows exactly what to fix.
4. **Three-source verification.** Each record is compared with the counselling allotment, DigiLocker marksheets, student confirmation, NSP scholarship data and ABC credits. A Truth Score is calculated, and a student is verified only when three or more sources agree.
5. **Student confirmation.** Students get a message on DigiLocker, SMS or a voice call asking if they joined the college. They can confirm or report "I did not join".
6. **Fraud check.** Students linked by the same mobile number or bank account across colleges are grouped and shown to AICTE, which helps catch agent-run fake admissions.
7. **Verification and certificates.** Certificates carry a QR code with the APAAR ID and student ID. Employers can verify them without seeing private details like caste, quota or marks.

### What is new
- Records are trusted only after independent sources agree, not just because the college uploaded them.
- If a student earns no credits in the first semester, the record is flagged as a possible ghost student.
- AICTE can test a policy change, such as a new NRI seat limit, before announcing it.
- Genuine cases like UGC dual-degree students are not wrongly flagged, and colleges can appeal.
- One verified upload can fill AICTE, AISHE and NIRF reports, which saves colleges repeated work.

### Technology
Next.js and React for the web portals; FastAPI and PostgreSQL for the backend; Python and NetworkX for duplicate and fraud checks; Keycloak for role-based login; HashiCorp Vault for protecting APAAR IDs; and a hash-chained audit log for tracking every change. For the prototype, APAAR, DigiLocker, counselling and NSP are simulated with sample data in their real formats.

### Impact
- AICTE gets accurate student-level data, real-time monitoring and better data for approvals and policy.
- Scholarships reach only genuine students.
- Colleges spend less time on paperwork.
- Students are protected from fake enrolment and seat blocking.
- Employers can verify degrees instantly.
- The platform follows the DPDP Act 2023 through consent records, access logs and role-based access.
