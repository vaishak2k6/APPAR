import Link from "next/link";
import clsx from "clsx";
import { Download, Filter } from "lucide-react";
import { Badge, Button, Meter, PageHeader, Panel, ScoreChip, Table, TD, TH } from "@/components/ui/primitives";
import { INSTITUTIONS } from "@/lib/data";
import { pct, ratio, riskTone, submissionTone } from "@/lib/format";

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-[12.5px] text-muted">
      {label}
      <select className="h-8 rounded border border-line-strong bg-white px-2 text-[13px] text-ink focus:border-navy-600 focus:outline-none">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function InstitutionsPage() {
  const rows = [...INSTITUTIONS].sort((a, b) => b.risk - a.risk);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Institutions" }]}
        title="Institutions"
        description="Submission status, seat utilisation and verification health for every AICTE-approved institution."
        actions={
          <Button>
            <Download className="size-4" aria-hidden />
            Download list
          </Button>
        }
      />

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3">
          <Filter className="size-4 text-faint" aria-hidden />
          <Select label="State" options={["All states", "Karnataka", "Madhya Pradesh", "Uttar Pradesh", "Rajasthan"]} />
          <Select label="Programme" options={["All", "Engineering", "Management", "Pharmacy"]} />
          <Select label="Submission" options={["Any status", "Submitted", "Awaiting checker", "In progress", "Not started", "Under audit"]} />
          <Select label="Risk" options={["Any", "High (70+)", "Medium (40–69)", "Low (<40)"]} />
          <span className="ml-auto text-xs text-muted">Showing {rows.length} of 9,021</span>
        </div>
        <Table>
          <thead>
            <tr>
              <TH>Institution</TH>
              <TH>Location</TH>
              <TH>Submission</TH>
              <TH align="right">Approved</TH>
              <TH align="right">Admitted</TH>
              <TH className="w-40">Verified</TH>
              <TH align="right">Review</TH>
              <TH align="right">Flagged</TH>
              <TH align="center">Risk</TH>
              <TH>Updated</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const over = i.admitted > i.approvedIntake;
              return (
                <tr key={i.id} className="hover:bg-gray-50">
                  <TD>
                    <Link href={`/aicte/institutions/${i.id}`} className="font-medium text-navy-700 hover:underline">
                      {i.name}
                    </Link>
                    <div className="font-mono text-[11px] text-faint">
                      {i.aicteId} · {i.type}
                    </div>
                  </TD>
                  <TD className="text-muted">
                    {i.city}, {i.state}
                  </TD>
                  <TD>
                    <Badge tone={submissionTone[i.submission]} dot>
                      {i.submission}
                    </Badge>
                  </TD>
                  <TD align="right">{i.approvedIntake}</TD>
                  <TD align="right" className={clsx(over && "font-semibold text-red-700")}>
                    {i.admitted}
                    {over && <span className="ml-1 text-[11px]">(+{i.admitted - i.approvedIntake})</span>}
                  </TD>
                  <TD>
                    {i.submission === "Not started" ? (
                      <span className="text-xs text-faint">No records</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Meter value={i.verifiedPct} tone={i.verifiedPct >= 85 ? "success" : i.verifiedPct >= 70 ? "warning" : "danger"} className="w-20" />
                        <span className="text-xs tabular text-muted">{pct(i.verifiedPct)}</span>
                      </div>
                    )}
                  </TD>
                  <TD align="right">{i.underReview}</TD>
                  <TD align="right" className={clsx(i.flagged > 30 && "font-semibold text-red-700")}>
                    {i.flagged}
                  </TD>
                  <TD align="center">{i.submission === "Not started" ? <span className="text-faint">—</span> : <ScoreChip value={i.risk} tone={riskTone(i.risk)} />}</TD>
                  <TD className="whitespace-nowrap text-xs text-muted">{i.updated}</TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 text-xs text-muted">
          <span>Fill rate is admitted ÷ approved intake. {pct(ratio(352, 360))} for Kaveri College, for example.</span>
          <span className="flex items-center gap-1">
            <Button size="sm" disabled>
              Previous
            </Button>
            <Button size="sm">Next</Button>
          </span>
        </div>
      </Panel>
    </>
  );
}
