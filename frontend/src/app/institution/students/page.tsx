import { Download } from "lucide-react";
import { Badge, Button, PageHeader, Panel, ScoreChip, Table, TD, TH } from "@/components/ui/primitives";
import { SourceCells, SourceLegend } from "@/components/ui/sources";
import { reasonByCode, STUDENTS } from "@/lib/data";
import { maskApaar, scoreTone, statusTone } from "@/lib/format";

export default function StudentRecordsPage() {
  const rows = STUDENTS.filter((s) => s.institutionId === "kce-mysuru");
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Institution Portal", href: "/institution" }, { label: "Student records" }]}
        title="Student records"
        description="Every submitted record with its verification status. Corrections are made by uploading a correction batch, which goes through the checker again."
        actions={
          <Button>
            <Download className="size-4" aria-hidden />
            Export
          </Button>
        }
      />
      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 text-[13px]">
          {["All 352", "Verified 318", "Provisional 9", "Under review 19", "Flagged 6"].map((t, i) => (
            <button key={t} type="button" className={i === 0 ? "rounded bg-navy-700 px-2.5 py-1 font-medium text-white" : "rounded px-2.5 py-1 text-muted hover:bg-gray-100"}>
              {t}
            </button>
          ))}
        </div>
        <Table>
          <thead>
            <tr>
              <TH>Student</TH>
              <TH>Branch</TH>
              <TH>Quota</TH>
              <TH align="right">Year</TH>
              <TH>Sources</TH>
              <TH align="center">Truth Score</TH>
              <TH>Status</TH>
              <TH>Open issue</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <TD>
                  <div className="font-medium text-ink">{s.name}</div>
                  <div className="font-mono text-[11px] text-faint">
                    {maskApaar(s.apaar)} · {s.id}
                  </div>
                </TD>
                <TD>{s.branch}</TD>
                <TD>{s.quota}</TD>
                <TD align="right">{s.year}</TD>
                <TD>
                  <SourceCells sources={s.sources} />
                </TD>
                <TD align="center">
                  <ScoreChip value={s.score} tone={scoreTone(s.score)} />
                </TD>
                <TD>
                  <Badge tone={statusTone[s.status]} dot>
                    {s.status}
                  </Badge>
                </TD>
                <TD className="max-w-64 text-xs text-muted">
                  {s.reasons.length ? (
                    <>
                      <span className="font-mono text-faint">{s.reasons[0]}</span> {reasonByCode[s.reasons[0]].label}
                    </>
                  ) : (
                    "—"
                  )}
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="border-t border-line px-4 py-3">
          <SourceLegend />
        </div>
      </Panel>
    </>
  );
}
