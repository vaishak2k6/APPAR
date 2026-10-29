"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { FileSearch, UserRound } from "lucide-react";
import { Badge, Button, Panel, ScoreChip, Table, TD, TH } from "@/components/ui/primitives";
import { SourceCells, SourceLegend, SourceList } from "@/components/ui/sources";
import { institutionById, reasonByCode, REVIEW_CASES, studentById } from "@/lib/data";
import { maskApaar, scoreTone } from "@/lib/format";
import type { ReasonCode } from "@/lib/types";

const TABS: { id: "all" | ReasonCode["category"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Duplicate", label: "Duplicates" },
  { id: "Allotment", label: "Allotment" },
  { id: "Quota", label: "Quota" },
  { id: "Eligibility", label: "Eligibility" },
  { id: "Network", label: "Network" },
  { id: "Liveness", label: "Liveness" },
];

type Decision = "approved" | "rejected" | "evidence";

export function ReviewWorkspace() {
  const cases = useMemo(
    () =>
      REVIEW_CASES.map((c) => {
        const student = studentById(c.studentId)!;
        return { ...c, student, institution: institutionById(student.institutionId)! };
      }),
    [],
  );
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [note, setNote] = useState("");

  const visible = cases.filter((c) => tab === "all" || c.student.reasons.some((r) => reasonByCode[r]?.category === tab));
  const selected = cases.find((c) => c.id === selectedId) ?? visible[0];
  const countFor = (id: (typeof TABS)[number]["id"]) =>
    id === "all" ? cases.length : cases.filter((c) => c.student.reasons.some((r) => reasonByCode[r]?.category === id)).length;

  const decide = (d: Decision) => {
    if (!selected) return;
    setDecisions((prev) => ({ ...prev, [selected.id]: d }));
    setNote("");
  };

  return (
    <div className="grid gap-5 2xl:grid-cols-[1fr_440px] xl:grid-cols-[1fr_400px]">
      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap gap-1 border-b border-line px-3 pt-2" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px]",
                tab === t.id ? "border-navy-700 font-semibold text-navy-800" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
              <span className="rounded bg-gray-100 px-1.5 text-[11px] tabular text-muted">{countFor(t.id)}</span>
            </button>
          ))}
        </div>
        <Table>
          <thead>
            <tr>
              <TH>Case</TH>
              <TH>Student</TH>
              <TH>Reason</TH>
              <TH align="center">Score</TH>
              <TH>Sources</TH>
              <TH align="right">Age</TH>
              <TH>Status</TH>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const d = decisions[c.id];
              return (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={clsx("cursor-pointer", c.id === selected?.id ? "bg-navy-50" : "hover:bg-gray-50")}
                >
                  <TD className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={clsx("rounded px-1 text-[10.5px] font-bold", c.priority === "P1" ? "bg-red-100 text-red-800" : c.priority === "P2" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-muted")}>
                        {c.priority}
                      </span>
                      <span className="font-mono text-xs text-ink">{c.id}</span>
                    </div>
                  </TD>
                  <TD className="max-w-56">
                    <div className="whitespace-nowrap font-medium text-ink">{c.student.name}</div>
                    <div className="truncate text-[11.5px] text-muted">{c.institution.name}</div>
                  </TD>
                  <TD>
                    <div className="flex gap-1">
                      {c.student.reasons.map((r) => (
                        <Badge key={r} tone={reasonByCode[r].severity === "high" ? "danger" : "warning"}>
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </TD>
                  <TD align="center">
                    <ScoreChip value={c.student.score} tone={scoreTone(c.student.score)} />
                  </TD>
                  <TD>
                    <SourceCells sources={c.student.sources} />
                  </TD>
                  <TD align="right" className="text-muted">
                    {c.ageDays}d
                  </TD>
                  <TD>
                    {d === "approved" ? (
                      <Badge tone="success">Verified</Badge>
                    ) : d === "rejected" ? (
                      <Badge tone="danger">Rejected</Badge>
                    ) : d === "evidence" ? (
                      <Badge tone="info">Evidence requested</Badge>
                    ) : (
                      <span className="text-xs text-muted">{c.assignee}</span>
                    )}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="border-t border-line px-4 py-3">
          <SourceLegend />
        </div>
      </Panel>

      {selected && (
        <Panel
          title={
            <span className="flex items-center gap-2">
              <FileSearch className="size-4 text-faint" aria-hidden />
              <span className="font-mono text-[13px]">{selected.id}</span>
            </span>
          }
          description={`Opened ${selected.opened} · assigned to ${selected.assignee}`}
          className="self-start xl:sticky xl:top-20"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-gray-100 text-muted">
              <UserRound className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-ink">{selected.student.name}</div>
              <div className="font-mono text-xs text-muted">APAAR {maskApaar(selected.student.apaar)}</div>
              <div className="mt-1 text-[12.5px] text-muted">
                {selected.student.branch} · {selected.student.quota} · Year {selected.student.year} · {selected.institution.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted">Truth Score</div>
              <div className={clsx("text-[22px] font-semibold tabular", selected.student.score >= 80 ? "text-emerald-700" : selected.student.score >= 50 ? "text-amber-700" : "text-red-700")}>
                {selected.student.score}
              </div>
            </div>
          </div>

          <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.05em] text-muted">Why this record is here</h3>
          <ul className="space-y-2">
            {selected.student.reasons.map((r) => (
              <li key={r} className="rounded border border-line bg-gray-50 px-3 py-2 text-[13px]">
                <span className="mr-2 font-mono text-xs text-faint">{r}</span>
                <span className="text-ink">{reasonByCode[r].label}</span>
              </li>
            ))}
          </ul>

          <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.05em] text-muted">Source checks</h3>
          <SourceList sources={selected.student.sources} />

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Reviewer note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Record the evidence you relied on. This note is shared with the institution."
              className="mt-2 w-full rounded border border-line-strong px-3 py-2 text-[13px] focus:border-navy-600 focus:outline-none"
            />
          </label>

          {decisions[selected.id] ? (
            <p className="mt-3 rounded border border-line bg-gray-50 px-3 py-2 text-[13px] text-body">
              Decision recorded: <span className="font-semibold">{decisions[selected.id] === "approved" ? "Marked verified" : decisions[selected.id] === "rejected" ? "Rejected" : "Evidence requested from institution"}</span>. Audit entry
              created.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="success" onClick={() => decide("approved")}>
                Mark verified
              </Button>
              <Button onClick={() => decide("evidence")}>Request evidence</Button>
              <Button variant="danger" onClick={() => decide("rejected")}>
                Reject record
              </Button>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
