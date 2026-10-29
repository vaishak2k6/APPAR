import Link from "next/link";
import { MessageSquareText, PhoneCall, Upload } from "lucide-react";
import { Badge, Button, Callout, PageHeader, Panel, StatStrip, Table, TD, TH } from "@/components/ui/primitives";
import { SeatLedgerTable } from "@/components/seat-ledger";
import { SEAT_LEDGER, STUDENTS } from "@/lib/data";
import { maskApaar } from "@/lib/format";

const PENDING = [
  { name: "Rahul Verma", apaar: "9152", branch: "ME", sent: "15 Oct", channel: "SMS + IVR", attempts: 3 },
  { name: "Lakshmi Priya S.", apaar: "4470", branch: "ECE", sent: "18 Oct", channel: "DigiLocker", attempts: 2 },
  { name: "Mohammed Irfan Shaikh", apaar: "7710", branch: "CSE", sent: "20 Oct", channel: "DigiLocker", attempts: 1 },
  { name: "Harsha Vardhan", apaar: "6203", branch: "CE", sent: "22 Oct", channel: "SMS + IVR", attempts: 1 },
];

const DEADLINES = [
  { date: "05 Nov", what: "Resolve 6 issues raised on batch 1" },
  { date: "15 Nov", what: "First-year submission window closes" },
  { date: "30 Nov", what: "Lateral-entry records due" },
  { date: "15 Dec", what: "AISHE return (auto-filled from verified records)" },
];

export default function InstitutionDashboard() {
  const issues = STUDENTS.filter((s) => s.institutionId === "kce-mysuru" && s.reasons.length > 0);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Institution Portal" }, { label: "Dashboard" }]}
        title="Kaveri College of Engineering, Mysuru"
        description="AICTE permanent ID 1-2814437 · Visvesvaraya Technological University · Admissions 2026–27"
        actions={
          <Button variant="primary" href="/institution/upload">
            <Upload className="size-4" aria-hidden />
            Submit records
          </Button>
        }
      />

      <div className="mb-5">
        <Callout
          tone="info"
          title="Batch 2 (64 rows) is awaiting the checker's signature"
          action={
            <Button size="sm" href="/institution/upload">
              Review batch
            </Button>
          }
        >
          Staged by Prakash Hegde on 29 Oct, 09:12. The Registrar or Principal must sign with Aadhaar eSign or DSC before it reaches AICTE.
        </Callout>
      </div>

      <StatStrip
        items={[
          { label: "Approved intake", value: 360, note: "+ supernumerary seats" },
          { label: "Records submitted", value: 352, note: "batches 1–2" },
          { label: "Verified", value: 318, note: "90.3% of submitted", tone: "success" },
          { label: "Awaiting student confirmation", value: 21, note: "reminders scheduled", tone: "warning" },
          { label: "Issues to fix", value: issues.length, note: "before 05 Nov", tone: "danger" },
          { label: "Over-cap uploads rejected", value: 4, note: "CSE Regular, NRI" },
        ]}
      />

      <div className="mt-5">
        <SeatLedgerTable rows={SEAT_LEDGER} description="Your minted seats for 2026–27. A seat is consumed when a record is accepted, and released if the student surrenders it." />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_320px]">
        <Panel
          title="Issues to fix"
          description="Raised by validation rules on submitted records"
          actions={<Button size="sm" variant="ghost" href="/institution/students">All records</Button>}
          bodyClassName="p-0"
        >
          <Table>
            <thead>
              <tr>
                <TH>Student</TH>
                <TH>Issue</TH>
              </tr>
            </thead>
            <tbody>
              {issues.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <TD>
                    <div className="font-medium text-ink">{s.name}</div>
                    <div className="font-mono text-[11px] text-faint">{maskApaar(s.apaar)}</div>
                  </TD>
                  <TD>
                    {s.reasons.map((r) => (
                      <Badge key={r} tone="danger">
                        {r}
                      </Badge>
                    ))}
                  </TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>

        <Panel title="Awaiting student confirmation" description="Students confirm through DigiLocker, SMS or a voice call" bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {PENDING.map((p) => (
              <li key={p.apaar} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-ink">{p.name}</div>
                  <div className="text-xs text-muted">
                    {p.branch} · sent {p.sent} via {p.channel} · {p.attempts} attempt{p.attempts > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" className="rounded border border-line p-1.5 text-muted hover:bg-gray-50 hover:text-ink" aria-label={`Resend SMS to ${p.name}`}>
                    <MessageSquareText className="size-3.5" />
                  </button>
                  <button type="button" className="rounded border border-line p-1.5 text-muted hover:bg-gray-50 hover:text-ink" aria-label={`Schedule voice call to ${p.name}`}>
                    <PhoneCall className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-2.5 text-xs text-muted">Unconfirmed records move to review after 14 days. Institutions cannot confirm on a student&apos;s behalf.</p>
        </Panel>

        <Panel title="Upcoming deadlines" bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {DEADLINES.map((d) => (
              <li key={d.date} className="flex gap-3 px-4 py-3">
                <span className="w-14 shrink-0 font-mono text-xs font-medium text-navy-700">{d.date}</span>
                <span className="text-[13px] text-body">{d.what}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-4 py-2.5 text-xs">
            <Link href="/institution/reports" className="text-navy-700 hover:underline">
              See auto-filled returns
            </Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
