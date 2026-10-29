// Synthetic demo data. Every name, ID and number here is fictional and exists only to drive the prototype UI.
// Replace these exports with API calls (see lib/api.ts) once the backend is ready.
import type {
  AuditEntry,
  Institution,
  PolicyRule,
  ReasonCode,
  ReviewCase,
  SeatLedgerRow,
  SourceKey,
  StudentRecord,
} from "./types";

export const AS_OF = "29 Oct 2026, 10:40 IST";
export const ACADEMIC_YEAR = "2026–27";

export const SOURCES: { key: SourceKey; label: string; short: string }[] = [
  { key: "institution", label: "Institution upload (Maker–Checker, eSign)", short: "Institution" },
  { key: "counselling", label: "Counselling allotment (JoSAA / CSAB / State CET)", short: "Counselling" },
  { key: "digilocker", label: "DigiLocker marksheets (eligibility)", short: "DigiLocker" },
  { key: "student", label: "Student confirmation (DigiLocker / SMS / IVR)", short: "Student" },
  { key: "scholarship", label: "Scholarship & fee records (NSP)", short: "NSP" },
  { key: "abc", label: "ABC credits & exam registration (liveness)", short: "ABC" },
];

export const REASONS: ReasonCode[] = [
  { code: "R-101", label: "Not found in counselling allotment list", category: "Allotment", severity: "high" },
  { code: "R-204", label: "Same APAAR ID active at another institution", category: "Duplicate", severity: "high" },
  { code: "R-215", label: "Probable duplicate: name + DOB match (0.93)", category: "Duplicate", severity: "medium" },
  { code: "R-310", label: "PCM aggregate below handbook eligibility threshold", category: "Eligibility", severity: "high" },
  { code: "R-402", label: "NRI seat without NRI proof", category: "Quota", severity: "high" },
  { code: "R-405", label: "OCI/FN seat: passport hash not attested", category: "Quota", severity: "medium" },
  { code: "R-501", label: "Upload exceeds minted seats for branch/quota", category: "Intake", severity: "high" },
  { code: "R-610", label: "Mobile number shared with 13 other students", category: "Network", severity: "high" },
  { code: "R-702", label: "No student confirmation after 14 days", category: "Liveness", severity: "low" },
  { code: "R-801", label: "No ABC credits or exam registration in Semester 1", category: "Liveness", severity: "medium" },
];

export const reasonByCode = Object.fromEntries(REASONS.map((r) => [r.code, r])) as Record<string, ReasonCode>;

export const NATIONAL_KPIS = {
  institutionsTotal: 9021,
  institutionsReporting: 8412,
  records: 2148630,
  verified: 1792114,
  underReview: 261083,
  flagged: 95433,
  blockedOverIntake: 4219,
};

export const SOURCE_MATCH_RATES: Record<SourceKey, number> = {
  institution: 100,
  counselling: 91.6,
  digilocker: 88.2,
  student: 79.4,
  scholarship: 64.1,
  abc: 72.8,
};

export const STATES = [
  { state: "Maharashtra", institutions: 1342, approved: 318400, admitted: 268910, verified: 86.1 },
  { state: "Tamil Nadu", institutions: 1196, approved: 296750, admitted: 241230, verified: 88.4 },
  { state: "Uttar Pradesh", institutions: 984, approved: 241300, admitted: 168220, verified: 74.9 },
  { state: "Andhra Pradesh", institutions: 742, approved: 205600, admitted: 171040, verified: 81.2 },
  { state: "Karnataka", institutions: 688, approved: 189200, admitted: 162870, verified: 89.7 },
  { state: "Telangana", institutions: 611, approved: 178900, admitted: 151300, verified: 83.5 },
  { state: "Madhya Pradesh", institutions: 498, approved: 118400, admitted: 71290, verified: 70.3 },
  { state: "Rajasthan", institutions: 431, approved: 96800, admitted: 58810, verified: 72.6 },
  { state: "Kerala", institutions: 362, approved: 74300, admitted: 55120, verified: 91.2 },
  { state: "Odisha", institutions: 298, approved: 68100, admitted: 44730, verified: 77.8 },
];

export const INSTITUTIONS: Institution[] = [
  { id: "kce-mysuru", aicteId: "1-2814437", name: "Kaveri College of Engineering", city: "Mysuru", state: "Karnataka", type: "Engineering", approvedIntake: 360, admitted: 352, verifiedPct: 90.3, underReview: 28, flagged: 6, risk: 18, topReason: "R-702", submission: "Awaiting checker", updated: "29 Oct, 09:12" },
  { id: "nit-jabalpur", aicteId: "1-3390214", name: "Narmada Institute of Technology", city: "Jabalpur", state: "Madhya Pradesh", type: "Engineering", approvedIntake: 540, admitted: 561, verifiedPct: 58.4, underReview: 142, flagged: 91, risk: 87, topReason: "R-501", submission: "Under audit", updated: "28 Oct, 18:40" },
  { id: "gyit-prayagraj", aicteId: "1-4102877", name: "Ganga-Yamuna Institute of Technology", city: "Prayagraj", state: "Uttar Pradesh", type: "Engineering", approvedIntake: 420, admitted: 418, verifiedPct: 61.2, underReview: 118, flagged: 44, risk: 81, topReason: "R-610", submission: "Submitted", updated: "28 Oct, 16:05" },
  { id: "aim-jaipur", aicteId: "1-3758120", name: "Aravalli Institute of Management", city: "Jaipur", state: "Rajasthan", type: "Management", approvedIntake: 180, admitted: 176, verifiedPct: 66.5, underReview: 41, flagged: 18, risk: 74, topReason: "R-402", submission: "Submitted", updated: "27 Oct, 11:30" },
  { id: "gec-rajahmundry", aicteId: "1-2998351", name: "Godavari Engineering College", city: "Rajahmundry", state: "Andhra Pradesh", type: "Engineering", approvedIntake: 600, admitted: 584, verifiedPct: 77.9, underReview: 96, flagged: 33, risk: 62, topReason: "R-204", submission: "Submitted", updated: "29 Oct, 08:02" },
  { id: "mit-cuttack", aicteId: "1-4417702", name: "Mahanadi Institute of Technology", city: "Cuttack", state: "Odisha", type: "Engineering", approvedIntake: 300, admitted: 241, verifiedPct: 79.3, underReview: 39, flagged: 11, risk: 47, topReason: "R-801", submission: "In progress", updated: "26 Oct, 15:48" },
  { id: "sie-pune", aicteId: "1-2205561", name: "Sahyadri Institute of Engineering & Technology", city: "Pune", state: "Maharashtra", type: "Engineering", approvedIntake: 720, admitted: 712, verifiedPct: 92.8, underReview: 41, flagged: 8, risk: 14, topReason: "R-702", submission: "Submitted", updated: "29 Oct, 07:55" },
  { id: "tct-tirunelveli", aicteId: "1-3021948", name: "Thamirabarani College of Technology", city: "Tirunelveli", state: "Tamil Nadu", type: "Engineering", approvedIntake: 480, admitted: 455, verifiedPct: 88.1, underReview: 44, flagged: 10, risk: 22, topReason: "R-215", submission: "Submitted", updated: "28 Oct, 12:20" },
  { id: "dsb-hyderabad", aicteId: "1-3866034", name: "Deccan School of Business", city: "Hyderabad", state: "Telangana", type: "Management", approvedIntake: 240, admitted: 238, verifiedPct: 85.7, underReview: 27, flagged: 7, risk: 29, topReason: "R-405", submission: "Submitted", updated: "27 Oct, 17:14" },
  { id: "mce-kozhikode", aicteId: "1-2730619", name: "Malabar College of Engineering", city: "Kozhikode", state: "Kerala", type: "Engineering", approvedIntake: 360, admitted: 301, verifiedPct: 94.4, underReview: 13, flagged: 4, risk: 9, topReason: "R-702", submission: "Submitted", updated: "28 Oct, 10:41" },
  { id: "bvec-guwahati", aicteId: "1-4590126", name: "Brahmaputra Valley Engineering College", city: "Guwahati", state: "Assam", type: "Engineering", approvedIntake: 240, admitted: 162, verifiedPct: 0, underReview: 0, flagged: 0, risk: 0, topReason: "", submission: "Not started", updated: "—" },
  { id: "sec-dehradun", aicteId: "1-3647790", name: "Shivalik Engineering College", city: "Dehradun", state: "Uttarakhand", type: "Engineering", approvedIntake: 300, admitted: 296, verifiedPct: 71.6, underReview: 62, flagged: 22, risk: 58, topReason: "R-101", submission: "Submitted", updated: "27 Oct, 09:26" },
];

export const institutionById = (id: string) => INSTITUTIONS.find((i) => i.id === id);

export const SEAT_LEDGER: SeatLedgerRow[] = [
  { branch: "Computer Science & Engg.", quota: "Regular", minted: 108, admitted: 108, confirmed: 101, blockedAttempts: 3 },
  { branch: "Computer Science & Engg.", quota: "TFWS", minted: 6, admitted: 6, confirmed: 6, blockedAttempts: 0 },
  { branch: "Computer Science & Engg.", quota: "NRI", minted: 12, admitted: 9, confirmed: 8, blockedAttempts: 1 },
  { branch: "Computer Science & Engg.", quota: "OCI/FN", minted: 6, admitted: 2, confirmed: 2, blockedAttempts: 0 },
  { branch: "AI & Data Science", quota: "Regular", minted: 54, admitted: 54, confirmed: 49, blockedAttempts: 0 },
  { branch: "AI & Data Science", quota: "TFWS", minted: 3, admitted: 3, confirmed: 3, blockedAttempts: 0 },
  { branch: "Electronics & Communication", quota: "Regular", minted: 54, admitted: 52, confirmed: 47, blockedAttempts: 0 },
  { branch: "Electronics & Communication", quota: "EWS", minted: 6, admitted: 5, confirmed: 5, blockedAttempts: 0 },
  { branch: "Mechanical Engineering", quota: "Regular", minted: 54, admitted: 49, confirmed: 41, blockedAttempts: 0 },
  { branch: "Civil Engineering", quota: "Regular", minted: 54, admitted: 47, confirmed: 39, blockedAttempts: 0 },
  { branch: "Mechanical Engineering", quota: "Lateral Entry", minted: 11, admitted: 9, confirmed: 9, blockedAttempts: 0 },
];

const S = (
  institution: StudentRecord["sources"]["institution"],
  counselling: StudentRecord["sources"]["counselling"],
  digilocker: StudentRecord["sources"]["digilocker"],
  student: StudentRecord["sources"]["student"],
  scholarship: StudentRecord["sources"]["scholarship"],
  abc: StudentRecord["sources"]["abc"],
) => ({ institution, counselling, digilocker, student, scholarship, abc });

export const STUDENTS: StudentRecord[] = [
  { id: "ST-004821", name: "Ananya Raghavan", apaar: "4821", branch: "CSE", quota: "Regular", year: 1, institutionId: "kce-mysuru", score: 96, status: "Verified", sources: S("match", "match", "match", "match", "na", "match"), reasons: [] },
  { id: "ST-004822", name: "Mohammed Irfan Shaikh", apaar: "7710", branch: "CSE", quota: "NRI", year: 1, institutionId: "kce-mysuru", score: 41, status: "Flagged", sources: S("match", "na", "match", "pending", "na", "pending"), reasons: ["R-402"] },
  { id: "ST-004823", name: "Pooja Kumari", apaar: "3304", branch: "ECE", quota: "EWS", year: 1, institutionId: "kce-mysuru", score: 88, status: "Verified", sources: S("match", "match", "match", "match", "match", "pending") , reasons: [] },
  { id: "ST-004824", name: "Rahul Verma", apaar: "9152", branch: "ME", quota: "Regular", year: 1, institutionId: "kce-mysuru", score: 63, status: "Under review", sources: S("match", "match", "match", "pending", "na", "pending"), reasons: ["R-702"] },
  { id: "ST-004825", name: "Sneha Patil", apaar: "6638", branch: "AI&DS", quota: "TFWS", year: 1, institutionId: "kce-mysuru", score: 92, status: "Verified", sources: S("match", "match", "match", "match", "match", "pending"), reasons: [] },
  { id: "ST-004826", name: "Arjun Nair", apaar: "2289", branch: "CE", quota: "Regular", year: 1, institutionId: "kce-mysuru", score: 58, status: "Under review", sources: S("match", "match", "mismatch", "match", "na", "pending"), reasons: ["R-310"] },
  { id: "ST-004827", name: "Fathima Zahra", apaar: "5517", branch: "CSE", quota: "OCI/FN", year: 1, institutionId: "kce-mysuru", score: 55, status: "Provisional", sources: S("match", "na", "na", "match", "na", "pending"), reasons: ["R-405"] },
  { id: "ST-004828", name: "Karthik Subramanian", apaar: "8046", branch: "CSE", quota: "Regular", year: 1, institutionId: "kce-mysuru", score: 94, status: "Verified", sources: S("match", "match", "match", "match", "na", "match"), reasons: [] },
  { id: "ST-004829", name: "Deepak Yadav", apaar: "1193", branch: "ME", quota: "Lateral Entry", year: 2, institutionId: "kce-mysuru", score: 84, status: "Verified", sources: S("match", "na", "match", "match", "match", "match"), reasons: [] },
  { id: "ST-004830", name: "Lakshmi Priya S.", apaar: "4470", branch: "ECE", quota: "Regular", year: 1, institutionId: "kce-mysuru", score: 47, status: "Flagged", sources: S("match", "mismatch", "match", "pending", "na", "pending"), reasons: ["R-101"] },
  { id: "ST-104511", name: "Amit Kumar Singh", apaar: "6021", branch: "CSE", quota: "Regular", year: 1, institutionId: "gyit-prayagraj", score: 22, status: "Flagged", sources: S("match", "mismatch", "match", "pending", "mismatch", "pending"), reasons: ["R-610", "R-101"] },
  { id: "ST-104512", name: "Ravi Shankar Mishra", apaar: "6021", branch: "ECE", quota: "Regular", year: 1, institutionId: "nit-jabalpur", score: 31, status: "Flagged", sources: S("match", "match", "match", "pending", "mismatch", "pending"), reasons: ["R-204"] },
  { id: "ST-104513", name: "Neha Gupta", apaar: "3958", branch: "IT", quota: "Regular", year: 1, institutionId: "nit-jabalpur", score: 18, status: "Flagged", sources: S("match", "na", "match", "pending", "pending", "pending"), reasons: ["R-501"] },
  { id: "ST-104514", name: "Suresh Babu K.", apaar: "7385", branch: "CE", quota: "Regular", year: 1, institutionId: "gec-rajahmundry", score: 52, status: "Under review", sources: S("match", "match", "match", "pending", "na", "mismatch"), reasons: ["R-801"] },
  { id: "ST-104515", name: "Aditi Sharma", apaar: "2741", branch: "MBA", quota: "NRI", year: 1, institutionId: "aim-jaipur", score: 36, status: "Flagged", sources: S("match", "na", "match", "match", "na", "pending"), reasons: ["R-402"] },
  { id: "ST-104516", name: "Md. Irfan Shaikh", apaar: "7718", branch: "CSE", quota: "Regular", year: 1, institutionId: "gec-rajahmundry", score: 44, status: "Under review", sources: S("match", "match", "match", "pending", "na", "pending"), reasons: ["R-215"] },
  { id: "ST-104517", name: "Vikas Tiwari", apaar: "5590", branch: "ME", quota: "Regular", year: 1, institutionId: "gyit-prayagraj", score: 25, status: "Flagged", sources: S("match", "mismatch", "match", "pending", "mismatch", "pending"), reasons: ["R-610"] },
  { id: "ST-104518", name: "Priyanka Das", apaar: "8812", branch: "EEE", quota: "Regular", year: 1, institutionId: "sec-dehradun", score: 49, status: "Under review", sources: S("match", "mismatch", "match", "match", "na", "pending"), reasons: ["R-101"] },
];

export const studentById = (id: string) => STUDENTS.find((s) => s.id === id);

export const REVIEW_CASES: ReviewCase[] = [
  { id: "CASE-26-01482", studentId: "ST-104511", opened: "21 Oct 2026", ageDays: 8, assignee: "R. Menon", priority: "P1" },
  { id: "CASE-26-01477", studentId: "ST-104512", opened: "20 Oct 2026", ageDays: 9, assignee: "R. Menon", priority: "P1" },
  { id: "CASE-26-01503", studentId: "ST-104513", opened: "23 Oct 2026", ageDays: 6, assignee: "Unassigned", priority: "P1" },
  { id: "CASE-26-01511", studentId: "ST-104515", opened: "24 Oct 2026", ageDays: 5, assignee: "S. Kulkarni", priority: "P1" },
  { id: "CASE-26-01519", studentId: "ST-104517", opened: "24 Oct 2026", ageDays: 5, assignee: "Unassigned", priority: "P1" },
  { id: "CASE-26-01526", studentId: "ST-004830", opened: "25 Oct 2026", ageDays: 4, assignee: "A. Joseph", priority: "P2" },
  { id: "CASE-26-01532", studentId: "ST-104516", opened: "26 Oct 2026", ageDays: 3, assignee: "A. Joseph", priority: "P2" },
  { id: "CASE-26-01540", studentId: "ST-004826", opened: "26 Oct 2026", ageDays: 3, assignee: "Unassigned", priority: "P2" },
  { id: "CASE-26-01548", studentId: "ST-104514", opened: "27 Oct 2026", ageDays: 2, assignee: "S. Kulkarni", priority: "P3" },
  { id: "CASE-26-01551", studentId: "ST-104518", opened: "27 Oct 2026", ageDays: 2, assignee: "Unassigned", priority: "P3" },
  { id: "CASE-26-01557", studentId: "ST-004824", opened: "28 Oct 2026", ageDays: 1, assignee: "Unassigned", priority: "P3" },
];

export const ALERTS = [
  { time: "10:22", severity: "high" as const, text: "Narmada Institute of Technology attempted 21 Regular-quota uploads beyond minted seats (IT branch). All rejected.", href: "/aicte/institutions/nit-jabalpur" },
  { time: "09:48", severity: "high" as const, text: "New fraud ring R-17: 14 students across 3 institutions share one mobile number.", href: "/aicte/fraud-rings" },
  { time: "09:05", severity: "medium" as const, text: "Aravalli Institute of Management filled 9 NRI seats within 2 hours of the upload deadline.", href: "/aicte/institutions/aim-jaipur" },
  { time: "08:31", severity: "medium" as const, text: "NIRF student strength for Godavari Engineering College differs from AICTE records by 11.4%.", href: "/aicte/reports" },
  { time: "Yesterday", severity: "low" as const, text: "Daily Merkle root anchored. Chain of 4,81,22,904 entries verified.", href: "/aicte/audit" },
];

export const POLICY_RULES: PolicyRule[] = [
  {
    id: "RULE-INTAKE-01", title: "Admissions cannot exceed minted seats per branch and quota", category: "Intake", source: "Approval Process Handbook 2026–27", version: "v4", status: "Active", checks: 2148630, violations: 4219,
    expression: `{
  "rule": "RULE-INTAKE-01",
  "when": { "event": "record.upload" },
  "assert": { "<=": [
    { "count": ["admitted", "branch", "quota", "year"] },
    { "var": "ledger.minted" }
  ]},
  "onFail": { "action": "reject", "reason": "R-501" }
}`,
  },
  {
    id: "RULE-NRI-02", title: "NRI seats require verified NRI status evidence", category: "Quota", source: "Approval Process Handbook 2026–27", version: "v2", status: "Active", checks: 38412, violations: 1206,
    expression: `{
  "rule": "RULE-NRI-02",
  "when": { "==": [{ "var": "record.quota" }, "NRI"] },
  "assert": { "in": [{ "var": "evidence.nri.status" }, ["attested", "verified"]] },
  "onFail": { "action": "flag", "reason": "R-402" }
}`,
  },
  {
    id: "RULE-ELIG-03", title: "Qualifying-exam aggregate meets programme eligibility", category: "Eligibility", source: "Approval Process Handbook 2026–27", version: "v3", status: "Active", checks: 1912006, violations: 8840,
    expression: `{
  "rule": "RULE-ELIG-03",
  "when": { "==": [{ "var": "programme.level" }, "UG"] },
  "assert": { ">=": [
    { "var": "digilocker.pcm_aggregate" },
    { "var": "policy.min_aggregate[record.category]" }
  ]},
  "onFail": { "action": "review", "reason": "R-310" }
}`,
  },
  {
    id: "RULE-DUP-04", title: "One active first-year enrolment per APAAR ID", category: "Duplicate", source: "Platform integrity policy", version: "v2", status: "Active", checks: 2148630, violations: 6631,
    expression: `{
  "rule": "RULE-DUP-04",
  "when": { "event": "record.upload" },
  "assert": { "==": [{ "count_active": { "var": "record.apaar_hmac" } }, 0] },
  "except": ["ugc_dual_degree", "counselling_upgrade", "transfer_in_progress"],
  "onFail": { "action": "review", "reason": "R-204" }
}`,
  },
  {
    id: "RULE-LIVE-05", title: "Semester-1 academic activity must appear in ABC", category: "Liveness", source: "Platform integrity policy", version: "v1", status: "Draft", checks: 0, violations: 0,
    expression: `{
  "rule": "RULE-LIVE-05",
  "when": { "event": "semester.close", "semester": 1 },
  "assert": { "or": [
    { ">": [{ "var": "abc.credits_earned" }, 0] },
    { "==": [{ "var": "exam.registered" }, true] }
  ]},
  "onFail": { "action": "review", "reason": "R-801" }
}`,
  },
];

/** NRI admissions as a % of approved intake, per institution: drives the policy simulator. */
export const NRI_SHARE: { name: string; state: string; share: number; intake: number }[] = [
  { name: "Aravalli Institute of Management", state: "Rajasthan", share: 21.4, intake: 180 },
  { name: "Narmada Institute of Technology", state: "Madhya Pradesh", share: 17.9, intake: 540 },
  { name: "Deccan School of Business", state: "Telangana", share: 14.2, intake: 240 },
  { name: "Godavari Engineering College", state: "Andhra Pradesh", share: 12.6, intake: 600 },
  { name: "Ganga-Yamuna Institute of Technology", state: "Uttar Pradesh", share: 11.8, intake: 420 },
  { name: "Shivalik Engineering College", state: "Uttarakhand", share: 10.4, intake: 300 },
  { name: "Kaveri College of Engineering", state: "Karnataka", share: 8.3, intake: 360 },
  { name: "Thamirabarani College of Technology", state: "Tamil Nadu", share: 7.1, intake: 480 },
  { name: "Sahyadri Institute of Engineering & Technology", state: "Maharashtra", share: 6.4, intake: 720 },
  { name: "Mahanadi Institute of Technology", state: "Odisha", share: 4.9, intake: 300 },
  { name: "Malabar College of Engineering", state: "Kerala", share: 3.2, intake: 360 },
];

export const FRAUD_RINGS = [
  { id: "R-17", link: "Mobile ••••4417", linkType: "Shared mobile", students: 14, institutions: ["Ganga-Yamuna Institute of Technology", "Narmada Institute of Technology", "Shivalik Engineering College"], confidence: 0.94, status: "New", detected: "29 Oct, 09:48" },
  { id: "R-16", link: "Bank a/c ••••0932", linkType: "Shared bank account", students: 9, institutions: ["Aravalli Institute of Management", "Deccan School of Business"], confidence: 0.88, status: "Investigating", detected: "26 Oct, 14:10" },
  { id: "R-14", link: "Guardian + address", linkType: "Shared guardian", students: 6, institutions: ["Godavari Engineering College"], confidence: 0.71, status: "Investigating", detected: "22 Oct, 11:02" },
  { id: "R-11", link: "Mobile ••••2280", linkType: "Shared mobile", students: 4, institutions: ["Mahanadi Institute of Technology"], confidence: 0.42, status: "Cleared", detected: "15 Oct, 16:37" },
];

export const AUDIT_LOG: AuditEntry[] = [
  { seq: 48122904, time: "29 Oct 2026 10:22:41", actor: "system", role: "Rule engine", action: "UPLOAD_REJECTED", entity: "nit-jabalpur / IT / Regular (21 rows)", hash: "9f3c51e0a2d7", prev: "e1b0447c9a35" },
  { seq: 48122903, time: "29 Oct 2026 10:19:08", actor: "r.menon", role: "AICTE reviewer", action: "CASE_ESCALATED", entity: "CASE-26-01482", hash: "e1b0447c9a35", prev: "7ac29d13f604" },
  { seq: 48122902, time: "29 Oct 2026 09:48:12", actor: "system", role: "Graph engine", action: "RING_DETECTED", entity: "R-17 (14 students)", hash: "7ac29d13f604", prev: "2d8e61b5c071" },
  { seq: 48122901, time: "29 Oct 2026 09:12:55", actor: "admissions.kce", role: "Institution maker", action: "BATCH_STAGED", entity: "kce-mysuru / batch 2 (64 rows)", hash: "2d8e61b5c071", prev: "c4f90a3e18bd" },
  { seq: 48122900, time: "29 Oct 2026 08:57:30", actor: "student", role: "Student (OTP)", action: "ADMISSION_CONFIRMED", entity: "ST-004821", hash: "c4f90a3e18bd", prev: "51a7d2e94c08" },
  { seq: 48122899, time: "29 Oct 2026 08:31:04", actor: "system", role: "Report engine", action: "MISMATCH_RAISED", entity: "gec-rajahmundry / NIRF vs AICTE", hash: "51a7d2e94c08", prev: "0be3f7716a92" },
  { seq: 48122898, time: "29 Oct 2026 00:00:00", actor: "system", role: "Anchor service", action: "ROOT_ANCHORED", entity: "Daily Merkle root 28 Oct", hash: "0be3f7716a92", prev: "f6d18c25e7a4" },
  { seq: 48122897, time: "28 Oct 2026 23:41:17", actor: "registrar.sie", role: "Institution checker", action: "BATCH_SIGNED_DSC", entity: "sie-pune / batch 3 (210 rows)", hash: "f6d18c25e7a4", prev: "93ce0b8a7d51" },
];

export const REPORTS = [
  { id: "eoa", name: "Extension of Approval: student annexure", audience: "AICTE", formats: ["XLSX", "PDF"], last: "28 Oct 2026" },
  { id: "aishe", name: "AISHE: institution student data (Form DCF-II)", audience: "Ministry of Education", formats: ["XLSX"], last: "21 Oct 2026" },
  { id: "nirf", name: "NIRF: sanctioned intake & total student strength", audience: "NIRF", formats: ["XLSX", "CSV"], last: "19 Oct 2026" },
  { id: "naac", name: "NAAC: student enrolment & profile metrics", audience: "NAAC / NBA", formats: ["XLSX", "PDF"], last: "—" },
  { id: "policy", name: "State-wise fill rate & vacancy analysis", audience: "AICTE policy cell", formats: ["PDF", "CSV"], last: "27 Oct 2026" },
  { id: "open", name: "Open dataset (differentially private)", audience: "Public", formats: ["CSV"], last: "01 Oct 2026" },
];

export const CROSS_PORTAL = [
  { institution: "Godavari Engineering College", aicte: 584, aishe: 590, nirf: 651, status: "Mismatch" as const },
  { institution: "Narmada Institute of Technology", aicte: 561, aishe: 498, nirf: 540, status: "Mismatch" as const },
  { institution: "Sahyadri Institute of Engineering & Technology", aicte: 712, aishe: 712, nirf: 709, status: "Consistent" as const },
  { institution: "Kaveri College of Engineering", aicte: 352, aishe: 352, nirf: 352, status: "Consistent" as const },
  { institution: "Shivalik Engineering College", aicte: 296, aishe: 301, nirf: 296, status: "Minor" as const },
];
