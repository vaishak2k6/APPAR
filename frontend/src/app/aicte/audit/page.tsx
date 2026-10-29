import { ShieldCheck } from "lucide-react";
import { Badge, Button, PageHeader, Panel, StatStrip, Table, TD, TH } from "@/components/ui/primitives";
import { AUDIT_LOG } from "@/lib/data";
import { inr } from "@/lib/format";

export default function AuditPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Audit log" }]}
        title="Audit log"
        description="Append-only, hash-chained record of every upload, decision and access. Each entry includes the hash of the previous one, so any later edit breaks the chain."
        actions={
          <Button variant="primary">
            <ShieldCheck className="size-4" aria-hidden />
            Verify chain now
          </Button>
        }
      />

      <StatStrip
        items={[
          { label: "Chain integrity", value: <span className="text-emerald-700">Intact</span>, note: "Last full check 29 Oct, 06:00", tone: "success" },
          { label: "Entries", value: inr(48122904), note: "since 1 Jul 2026" },
          { label: "Last anchored root", value: <span className="font-mono text-[17px]">0be3f771…</span>, note: "29 Oct 2026, 00:00 IST" },
          { label: "Anchor", value: <span className="text-[17px]">Timestamp authority</span>, note: "RFC 3161 · daily + at deadline" },
        ]}
      />

      <Panel className="mt-5" bodyClassName="p-0">
        <Table>
          <thead>
            <tr>
              <TH>Seq</TH>
              <TH>Time (IST)</TH>
              <TH>Actor</TH>
              <TH>Action</TH>
              <TH>Entity</TH>
              <TH>Entry hash</TH>
              <TH>Previous hash</TH>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((e) => (
              <tr key={e.seq} className="hover:bg-gray-50">
                <TD mono className="text-faint">
                  {inr(e.seq)}
                </TD>
                <TD className="whitespace-nowrap text-muted">{e.time}</TD>
                <TD>
                  <div className="text-ink">{e.actor}</div>
                  <div className="text-xs text-faint">{e.role}</div>
                </TD>
                <TD>
                  <Badge tone={e.action.includes("REJECT") || e.action.includes("RING") ? "danger" : e.action.includes("ANCHOR") || e.action.includes("SIGNED") || e.action.includes("CONFIRMED") ? "success" : "neutral"}>
                    <span className="font-mono">{e.action}</span>
                  </Badge>
                </TD>
                <TD className="text-body">{e.entity}</TD>
                <TD mono className="text-ink">
                  {e.hash}
                </TD>
                <TD mono className="text-faint">
                  {e.prev}
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </>
  );
}
