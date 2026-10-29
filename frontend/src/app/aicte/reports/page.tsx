import { FileDown } from "lucide-react";
import { Badge, Button, PageHeader, Panel, Table, TD, TH } from "@/components/ui/primitives";
import { CROSS_PORTAL, REPORTS } from "@/lib/data";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Reports" }]}
        title="Reports"
        description="Regulatory returns and policy reports generated from the verified repository. Public datasets are released with differential privacy so no individual student can be identified."
      />

      <Panel title="Report templates" bodyClassName="p-0">
        <Table>
          <thead>
            <tr>
              <TH>Report</TH>
              <TH>Prepared for</TH>
              <TH>Formats</TH>
              <TH>Last generated</TH>
              <TH />
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <TD className="font-medium text-ink">{r.name}</TD>
                <TD className="text-muted">{r.audience}</TD>
                <TD>
                  <div className="flex gap-1">
                    {r.formats.map((f) => (
                      <span key={f} className="rounded border border-line px-1.5 py-px font-mono text-[11px] text-muted">
                        {f}
                      </span>
                    ))}
                  </div>
                </TD>
                <TD className="text-muted">{r.last}</TD>
                <TD align="right">
                  <Button size="sm">
                    <FileDown className="size-3.5" aria-hidden />
                    Generate
                  </Button>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <Panel
        className="mt-5"
        title="Cross-portal consistency"
        description="Student strength reported by the same institution to different portals. Differences above 2% are raised for clarification."
        bodyClassName="p-0"
      >
        <Table>
          <thead>
            <tr>
              <TH>Institution</TH>
              <TH align="right">APAAR-Satya (verified)</TH>
              <TH align="right">AISHE</TH>
              <TH align="right">NIRF</TH>
              <TH align="right">Max deviation</TH>
              <TH>Status</TH>
            </tr>
          </thead>
          <tbody>
            {CROSS_PORTAL.map((r) => {
              const dev = Math.max(Math.abs(r.aishe - r.aicte), Math.abs(r.nirf - r.aicte)) / r.aicte * 100;
              return (
                <tr key={r.institution} className="hover:bg-gray-50">
                  <TD className="text-ink">{r.institution}</TD>
                  <TD align="right" className="font-medium">
                    {r.aicte}
                  </TD>
                  <TD align="right" className={r.aishe !== r.aicte ? "text-red-700" : undefined}>
                    {r.aishe}
                  </TD>
                  <TD align="right" className={r.nirf !== r.aicte ? "text-red-700" : undefined}>
                    {r.nirf}
                  </TD>
                  <TD align="right">{dev.toFixed(1)}%</TD>
                  <TD>
                    <Badge tone={r.status === "Mismatch" ? "danger" : r.status === "Minor" ? "warning" : "success"} dot>
                      {r.status}
                    </Badge>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Panel>
    </>
  );
}
