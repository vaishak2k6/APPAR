export type RecordStatus = "Verified" | "Provisional" | "Under review" | "Flagged";

export type SubmissionStatus = "Submitted" | "Awaiting checker" | "In progress" | "Not started" | "Under audit";

export type Quota = "Regular" | "TFWS" | "EWS" | "NRI" | "OCI/FN" | "Lateral Entry";

/** The six independent sources a student record is triangulated against. */
export type SourceKey = "institution" | "counselling" | "digilocker" | "student" | "scholarship" | "abc";

export type SourceResult = "match" | "mismatch" | "pending" | "na";

export interface Institution {
  id: string;
  aicteId: string;
  name: string;
  city: string;
  state: string;
  type: "Engineering" | "Management" | "Pharmacy";
  approvedIntake: number;
  admitted: number;
  verifiedPct: number;
  underReview: number;
  flagged: number;
  risk: number;
  topReason: string;
  submission: SubmissionStatus;
  updated: string;
}

export interface SeatLedgerRow {
  branch: string;
  quota: Quota;
  minted: number;
  admitted: number;
  confirmed: number;
  blockedAttempts: number;
}

export interface ReasonCode {
  code: string;
  label: string;
  category: "Duplicate" | "Eligibility" | "Quota" | "Liveness" | "Allotment" | "Network" | "Intake";
  severity: "high" | "medium" | "low";
}

export interface StudentRecord {
  id: string;
  name: string;
  apaar: string;
  branch: string;
  quota: Quota;
  year: number;
  institutionId: string;
  score: number;
  status: RecordStatus;
  sources: Record<SourceKey, SourceResult>;
  reasons: string[];
}

export interface ReviewCase {
  id: string;
  studentId: string;
  opened: string;
  ageDays: number;
  assignee: string;
  priority: "P1" | "P2" | "P3";
}

export interface AuditEntry {
  seq: number;
  time: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  hash: string;
  prev: string;
}

export interface PolicyRule {
  id: string;
  title: string;
  category: string;
  source: string;
  version: string;
  status: "Active" | "Draft";
  checks: number;
  violations: number;
  expression: string;
}
