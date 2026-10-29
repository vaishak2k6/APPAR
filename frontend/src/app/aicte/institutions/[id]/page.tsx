import { notFound } from "next/navigation";
import clsx from "clsx";
import { CalendarClock, Download, ShieldAlert } from "lucide-react";
import { Badge, Button, Callout, Meter, PageHeader, Panel, ScoreChip, StatStrip, Table, TD, TH } from "@/components/ui/primitives";
import { SeatLedgerTable } from "@/components/seat-ledger";
import { institutionById, REASONS, SEAT_LEDGER } from "@/lib/data";
import { pct, ratio, riskTone, submissionTone } from "@/lib/format";

const TIMELINE = [
  { time: "29 Oct, 09:12", who: "Prakash Hegde · Maker", what: "Staged batch 2 (64 rows). 57 passed, 4 errors, 3 warnings." },
  { time: "27 Oct, 18:30", who: "Dr. S. Ramaswamy · Checker", what: "Signed batch 1 (288 rows) with DSC." },
  { time: "27 Oct, 16:02", who: "Prakash Hegde · Maker", what: "Fixed 9 rows rejected for missing APAAR IDs; 6 sent for APAAR generation via ABC." },
  { time: "24 Oct, 11:47", who: "AICTE · System", what: "Seats minted from Extension of Approval 2026–27 (360 + supernumerary)." },
];

const SCORE_BUCKETS = [
  { label: "90–100", n: 214, tone: "success" as const },
  { label: "80–89", n: 104, tone: "success" as const },
  { label: "50–79", n: 28, tone: "warning" as const },
  { label: "0–49", n: 6, tone: "danger" as const },
];

export default async function InstitutionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inst = institutionById(id);
  if (!inst) notFound();

  const flags = REASONS.slice(0, 7).map((r, i) => ({ ...r, count: [3, 2, 1, 1, 0, 1, 0][i] + (inst.flagged > 20 ? (i + 2) * 3 : 0) })).filter((f) => f.count > 0);
  const maxBucket = Math.max(...SCORE_BUCKETS.map((b) => b.n));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Institutions", href: "/aicte/institutions" }, { label: inst.name }]}
        title={inst.name}
        description={`${inst.city}, ${inst.state} · ${inst.type} · AICTE permanent ID ${inst.aicteId}`}
        meta={
          <>
            <Badge tone={submissionTone[inst.submission]} dot>
              {inst.submission}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              Risk score <ScoreChip value={inst.risk} tone={riskTone(inst.risk)} />
            </span>
          </>
        }
        actions={
          <>
            <Button>
              <Download className="size-4" aria-hidden />
              Institution report
            </Button>
            <Button variant="primary">
              <CalendarClock className="size-4" aria-hidden />
              Schedule inspection
            </Button>
          </>
        }
      />

      {inst.admitted > inst.approvedIntake && (
        <div className="mb-5">
          <Callout tone="danger" title={`Upload attempts exceed approved intake by ${inst.admitted - inst.approvedIntake} seats`}>
            Excess rows were rejected by RULE-INTAKE-01 and are not part of the central repository. The attempt is recorded in the audit log.
          </Callout>
        </div>
      )}

      <StatStrip
        items={[
          { label: "Approved intake", value: inst.approvedIntake, note: "Extension of Approval 2026–27" },
          { label: "Admitted (uploaded)", value: inst.admitted, note: `${pct(ratio(inst.admitted, inst.approvedIntake))} fill rate`, tone: inst.admitted > inst.approvedIntake ? "danger" : "neutral" },
          { label: "Verified", value: pct(inst.verifiedPct), note: "3+ sources agree", tone: "success" },
          { label: "Under review", value: inst.underReview, tone: "warning", note: "awaiting reviewer" },
          { label: "Flagged", value: inst.flagged, tone: "danger", note: "high-severity reasons" },
          { label: "Last activity", value: <span className="text-[17px]">{inst.updated}</span>, note: "Maker upload" },
        ]}
      />

      <div className="mt-5">
        <SeatLedgerTable rows={SEAT_LEDGER} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel title="Open flags by reason" description="Each flag cites the rule that raised it" bodyClassName="p-0" className="lg:col-span-2">
          <Table>
            <thead>
              <tr>
                <TH>Code</TH>
                <TH>Reason</TH>
                <TH>Category</TH>
                <TH align="right">Records</TH>
              </tr>
            </thead>
            <tbody>
              {flags.map((f) => (
                <tr key={f.code}>
                  <TD mono>{f.code}</TD>
                  <TD className="text-ink">{f.label}</TD>
                  <TD>
                    <Badge tone={f.severity === "high" ? "danger" : f.severity === "medium" ? "warning" : "neutral"}>{f.category}</Badge>
                  </TD>
                  <TD align="right">{f.count}</TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>

        <Panel title="Truth Score distribution" description="All records from this institution">
          <ul className="space-y-3">
            {SCORE_BUCKETS.map((b) => (
              <li key={b.label} className="grid grid-cols-[56px_1fr_36px] items-center gap-3 text-[13px]">
                <span className="font-mono text-xs text-muted">{b.label}</span>
                <Meter value={b.n} max={maxBucket} tone={b.tone} className="h-2.5" />
                <span className="text-right tabular text-ink">{b.n}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel title="Submission history" className="lg:col-span-2">
          <ol className="relative space-y-5 border-l border-line pl-5">
            {TIMELINE.map((t) => (
              <li key={t.time} className="relative">
                <span className="absolute -left-[25px] top-1 size-2.5 rounded-full border-2 border-white bg-navy-700 ring-1 ring-navy-700" />
                <div className="text-xs text-faint">
                  {t.time} · {t.who}
                </div>
                <div className="mt-0.5 text-[13px] text-body">{t.what}</div>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Inspection recommendation">
          <div className="flex items-start gap-3">
            <ShieldAlert className={clsx("mt-0.5 size-5 shrink-0", inst.risk >= 70 ? "text-red-700" : "text-amber-600")} aria-hidden />
            <div className="text-[13px] text-body">
              {inst.risk >= 70
                ? "Physical verification recommended. A risk-weighted sample of 40 students has been prepared for the inspection committee, with Aadhaar Face Authentication on site."
                : "No inspection needed this cycle. Continue routine monitoring; a random sample of 10 students will be checked remotely."}
            </div>
          </div>
          <Button size="sm" className="mt-4">
            View sample list
          </Button>
        </Panel>
      </div>
    </>
  );
}
