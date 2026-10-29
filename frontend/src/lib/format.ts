import type { RecordStatus, SubmissionStatus } from "./types";

/** Indian digit grouping: 21,48,630 */
export const inr = (n: number) => n.toLocaleString("en-IN");

export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;

export const ratio = (a: number, b: number) => (b === 0 ? 0 : (a / b) * 100);

/** APAAR IDs are always shown masked; only the last four digits are visible. */
export const maskApaar = (last4: string) => `XXXX XXXX ${last4}`;

export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

export const statusTone: Record<RecordStatus, Tone> = {
  Verified: "success",
  Provisional: "info",
  "Under review": "warning",
  Flagged: "danger",
};

export const submissionTone: Record<SubmissionStatus, Tone> = {
  Submitted: "success",
  "Awaiting checker": "info",
  "In progress": "neutral",
  "Not started": "neutral",
  "Under audit": "danger",
};

export const scoreTone = (score: number): Tone => (score >= 80 ? "success" : score >= 50 ? "warning" : "danger");

export const riskTone = (risk: number): Tone => (risk >= 70 ? "danger" : risk >= 40 ? "warning" : "success");
