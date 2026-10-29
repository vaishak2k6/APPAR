"use client";

import { useState } from "react";
import clsx from "clsx";
import { Badge, Button, Panel, Table, TD, TH } from "@/components/ui/primitives";
import { NRI_SHARE, POLICY_RULES } from "@/lib/data";
import { inr } from "@/lib/format";

export function PolicyWorkspace() {
  const [ruleId, setRuleId] = useState(POLICY_RULES[0].id);
  const rule = POLICY_RULES.find((r) => r.id === ruleId)!;
  const [cap, setCap] = useState(15);

  const affected = NRI_SHARE.filter((i) => i.share > cap);
  const seats = affected.reduce((t, i) => t + Math.round(((i.share - cap) / 100) * i.intake), 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Panel title="Rule register" bodyClassName="p-0">
          <Table>
            <thead>
              <tr>
                <TH>Rule</TH>
                <TH>Category</TH>
                <TH>Version</TH>
                <TH align="right">Checks run</TH>
                <TH align="right">Violations</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {POLICY_RULES.map((r) => (
                <tr key={r.id} onClick={() => setRuleId(r.id)} className={clsx("cursor-pointer", r.id === ruleId ? "bg-navy-50" : "hover:bg-gray-50")}>
                  <TD>
                    <div className="font-mono text-xs text-faint">{r.id}</div>
                    <div className="text-ink">{r.title}</div>
                  </TD>
                  <TD className="text-muted">{r.category}</TD>
                  <TD mono>{r.version}</TD>
                  <TD align="right">{r.checks ? inr(r.checks) : "—"}</TD>
                  <TD align="right">{r.violations ? inr(r.violations) : "—"}</TD>
                  <TD>
                    <Badge tone={r.status === "Active" ? "success" : "neutral"} dot>
                      {r.status}
                    </Badge>
                  </TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>

        <Panel
          title={rule.id}
          description={`${rule.title} · ${rule.version} · Source: ${rule.source}`}
          actions={
            <>
              <Button size="sm">History</Button>
              <Button size="sm">Edit draft</Button>
            </>
          }
        >
          <pre className="overflow-x-auto rounded border border-line bg-gray-50 p-3 font-mono text-[12px] leading-relaxed text-ink">{rule.expression}</pre>
          <p className="mt-3 text-xs text-muted">
            Rules are evaluated by the rule engine on every upload and on scheduled re-checks. Publishing a new version requires approval by two officers and is
            recorded in the audit log.
          </p>
        </Panel>
      </div>

      <Panel
        title="Policy simulator"
        description="Test a proposed change against verified 2026–27 data before it is notified. Nothing here changes live rules."
      >
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div>
            <label htmlFor="cap" className="text-[13px] font-medium text-ink">
              Proposed NRI quota cap
            </label>
            <p className="text-xs text-muted">As a percentage of approved intake, per institution</p>
            <div className="mt-4 flex items-center gap-3">
              <input id="cap" type="range" min={5} max={25} step={1} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="flex-1 accent-navy-700" />
              <span className="w-12 rounded border border-line-strong py-1 text-center font-mono text-[13px] tabular">{cap}%</span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line">
              <div className="bg-white px-3 py-2.5">
                <dt className="text-xs text-muted">Institutions over cap</dt>
                <dd className={clsx("text-[22px] font-semibold tabular", affected.length ? "text-red-700" : "text-emerald-700")}>{affected.length}</dd>
              </div>
              <div className="bg-white px-3 py-2.5">
                <dt className="text-xs text-muted">NRI seats affected</dt>
                <dd className="text-[22px] font-semibold tabular text-ink">{seats}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-faint">Sample of {NRI_SHARE.length} institutions shown. The full run covers all reporting institutions.</p>
          </div>

          <div>
            <div className="mb-2 grid grid-cols-[1fr_120px_56px] gap-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
              <span>Institution</span>
              <span>Current NRI share</span>
              <span className="text-right">Excess</span>
            </div>
            <ul className="space-y-2">
              {NRI_SHARE.map((i) => {
                const over = i.share > cap;
                return (
                  <li key={i.name} className="grid grid-cols-[1fr_120px_56px] items-center gap-3 text-[13px]">
                    <span className={clsx("truncate", over ? "font-medium text-ink" : "text-muted")}>
                      {i.name}
                      <span className="ml-1.5 text-xs text-faint">{i.state}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="relative h-2 flex-1 rounded-full bg-gray-200">
                        <span className={clsx("absolute inset-y-0 left-0 rounded-full", over ? "bg-red-600" : "bg-navy-700")} style={{ width: `${(i.share / 25) * 100}%` }} />
                        <span className="absolute -top-1 h-4 w-px bg-ink" style={{ left: `${(cap / 25) * 100}%` }} aria-hidden />
                      </span>
                      <span className="w-10 text-right text-xs tabular text-muted">{i.share.toFixed(1)}%</span>
                    </span>
                    <span className={clsx("text-right text-xs tabular", over ? "font-semibold text-red-700" : "text-faint")}>
                      {over ? `+${Math.round(((i.share - cap) / 100) * i.intake)}` : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-px bg-ink" /> Proposed cap
              </span>
              <Button size="sm" className="ml-auto">
                Export simulation
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
