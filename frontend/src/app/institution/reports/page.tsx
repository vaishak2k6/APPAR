import { FileDown } from "lucide-react";
import { Badge, Button, Callout, PageHeader, Panel, Table, TD, TH } from "@/components/ui/primitives";

const RETURNS = [
  { name: "AICTE Extension of Approval: student annexure", due: "With EoA application", status: "Ready", fields: "352 records · auto-filled" },
  { name: "AISHE: Form DCF-II student data", due: "15 Dec 2026", status: "Ready", fields: "Enrolment by programme, gender, category" },
  { name: "NIRF: sanctioned intake & total student strength", due: "Jan 2027", status: "Ready", fields: "Intake, strength, PhD (not applicable)" },
  { name: "NAAC: student enrolment & profile", due: "With SSR", status: "Draft", fields: "Needs outcome data from Semester 2" },
];

export default function InstitutionReportsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Institution Portal", href: "/institution" }, { label: "Reports & returns" }]}
        title="Reports & returns"
        description="Returns filled automatically from your verified records, so the same numbers go to every portal."
      />
      <div className="mb-5">
        <Callout tone="success" title="All three active returns use the same 352 verified records">
          Last cross-portal check found no mismatch between your AICTE, AISHE and NIRF figures.
        </Callout>
      </div>
      <Panel bodyClassName="p-0">
        <Table>
          <thead>
            <tr>
              <TH>Return</TH>
              <TH>Contents</TH>
              <TH>Due</TH>
              <TH>Status</TH>
              <TH />
            </tr>
          </thead>
          <tbody>
            {RETURNS.map((r) => (
              <tr key={r.name} className="hover:bg-gray-50">
                <TD className="font-medium text-ink">{r.name}</TD>
                <TD className="text-muted">{r.fields}</TD>
                <TD className="whitespace-nowrap text-muted">{r.due}</TD>
                <TD>
                  <Badge tone={r.status === "Ready" ? "success" : "neutral"} dot>
                    {r.status}
                  </Badge>
                </TD>
                <TD align="right">
                  <Button size="sm" disabled={r.status !== "Ready"}>
                    <FileDown className="size-3.5" aria-hidden />
                    Download
                  </Button>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </>
  );
}
