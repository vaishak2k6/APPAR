import clsx from "clsx";
import { Badge, Meter, Panel, Table, TD, TH } from "@/components/ui/primitives";
import type { SeatLedgerRow } from "@/lib/types";

/** Seat Ledger: seats minted from the Extension of Approval vs. records admitted and confirmed against them. */
export function SeatLedgerTable({ rows, title = "Seat ledger", description }: { rows: SeatLedgerRow[]; title?: string; description?: string }) {
  const totals = rows.reduce(
    (t, r) => ({ minted: t.minted + r.minted, admitted: t.admitted + r.admitted, confirmed: t.confirmed + r.confirmed, blocked: t.blocked + r.blockedAttempts }),
    { minted: 0, admitted: 0, confirmed: 0, blocked: 0 },
  );
  return (
    <Panel
      title={title}
      description={description ?? "Seats minted from the Extension of Approval, by branch and quota. Uploads beyond minted seats are rejected."}
      bodyClassName="p-0"
    >
      <Table>
        <thead>
          <tr>
            <TH>Branch</TH>
            <TH>Quota</TH>
            <TH align="right">Minted</TH>
            <TH align="right">Admitted</TH>
            <TH align="right">Confirmed by student</TH>
            <TH className="w-48">Utilisation</TH>
            <TH>Cap status</TH>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const full = r.admitted >= r.minted;
            return (
              <tr key={`${r.branch}-${r.quota}`} className="hover:bg-gray-50">
                <TD className="text-ink">{r.branch}</TD>
                <TD>
                  <span className={clsx("text-[13px]", r.quota !== "Regular" && "font-medium text-navy-700")}>{r.quota}</span>
                </TD>
                <TD align="right">{r.minted}</TD>
                <TD align="right">{r.admitted}</TD>
                <TD align="right">{r.confirmed}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <Meter value={r.admitted} max={r.minted} tone={full ? "warning" : "info"} className="w-28" />
                    <span className="text-xs tabular text-muted">
                      {r.admitted}/{r.minted}
                    </span>
                  </div>
                </TD>
                <TD>
                  {r.blockedAttempts > 0 ? (
                    <Badge tone="danger">{r.blockedAttempts} over-cap rejected</Badge>
                  ) : full ? (
                    <Badge tone="warning">At cap</Badge>
                  ) : (
                    <Badge tone="success">Within cap</Badge>
                  )}
                </TD>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 font-semibold text-ink">
            <TD>Total</TD>
            <TD />
            <TD align="right">{totals.minted}</TD>
            <TD align="right">{totals.admitted}</TD>
            <TD align="right">{totals.confirmed}</TD>
            <TD />
            <TD className="text-xs font-medium text-muted">{totals.blocked} rejected uploads</TD>
          </tr>
        </tfoot>
      </Table>
    </Panel>
  );
}
