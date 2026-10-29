"use client";

import { useState } from "react";
import clsx from "clsx";
import { Badge, Button, Panel } from "@/components/ui/primitives";
import { FRAUD_RINGS } from "@/lib/data";

const INST_COLORS = ["#1d4e89", "#b45309", "#15803d"];

/** Deterministic radial layout: link node in the centre, students on a ring, institutions on an outer ring. */
function RingGraph({ ring }: { ring: (typeof FRAUD_RINGS)[number] }) {
  const W = 640;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const nInst = ring.institutions.length;
  const instPos = ring.institutions.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / nInst + (nInst === 1 ? 0 : Math.PI / nInst);
    return { x: cx + Math.cos(a) * 250, y: cy + Math.sin(a) * 165 };
  });
  const students = Array.from({ length: ring.students }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ring.students;
    return { x: cx + Math.cos(a) * 120, y: cy + Math.sin(a) * 95, inst: i % nInst };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Graph of ring ${ring.id}`}>
      {students.map((s, i) => (
        <g key={`e${i}`}>
          <line x1={cx} y1={cy} x2={s.x} y2={s.y} stroke="#c3cad4" strokeWidth={1} />
          <line x1={s.x} y1={s.y} x2={instPos[s.inst].x} y2={instPos[s.inst].y} stroke={INST_COLORS[s.inst]} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 3" />
        </g>
      ))}
      {students.map((s, i) => (
        <g key={`s${i}`}>
          <circle cx={s.x} cy={s.y} r={9} fill="#fff" stroke={INST_COLORS[s.inst]} strokeWidth={2} />
          <text x={s.x} y={s.y + 3.5} textAnchor="middle" fontSize={9} fill="#2b3442" fontFamily="var(--font-plex-mono)">
            {i + 1}
          </text>
        </g>
      ))}
      <g>
        <rect x={cx - 62} y={cy - 18} width={124} height={36} rx={3} fill="#0e2240" />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize={11} fill="#fff" fontWeight={600}>
          {ring.linkType}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#dbe6f3" fontFamily="var(--font-plex-mono)">
          {ring.link}
        </text>
      </g>
      {instPos.map((p, i) => {
        const label = ring.institutions[i];
        const w = Math.min(240, label.length * 6.4 + 20);
        const x = Math.max(w / 2 + 6, Math.min(W - w / 2 - 6, p.x));
        return (
          <g key={`i${i}`}>
            <rect x={x - w / 2} y={p.y - 14} width={w} height={28} rx={3} fill="#fff" stroke={INST_COLORS[i]} strokeWidth={1.5} />
            <text x={x} y={p.y + 4} textAnchor="middle" fontSize={11} fill={INST_COLORS[i]} fontWeight={600}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function RingExplorer() {
  const [selectedId, setSelectedId] = useState(FRAUD_RINGS[0].id);
  const ring = FRAUD_RINGS.find((r) => r.id === selectedId)!;

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Panel title="Detected clusters" description="Sorted by confidence" bodyClassName="p-0" className="self-start">
        <ul className="divide-y divide-line">
          {FRAUD_RINGS.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={clsx("w-full px-4 py-3 text-left", r.id === selectedId ? "bg-navy-50" : "hover:bg-gray-50")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[13px] font-medium text-ink">{r.id}</span>
                  <Badge tone={r.status === "New" ? "danger" : r.status === "Investigating" ? "warning" : "neutral"}>{r.status}</Badge>
                </div>
                <div className="mt-1 text-[13px] text-body">
                  {r.students} students · {r.institutions.length} institution{r.institutions.length > 1 ? "s" : ""}
                </div>
                <div className="mt-0.5 flex items-center justify-between text-xs text-muted">
                  <span>{r.link}</span>
                  <span className="tabular">confidence {r.confidence.toFixed(2)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title={`Ring ${ring.id}: ${ring.students} students linked by one ${ring.linkType.toLowerCase().replace("shared ", "")}`}
        description={`Detected ${ring.detected} · confidence ${ring.confidence.toFixed(2)}`}
        actions={
          <>
            <Button size="sm">Mark as cleared</Button>
            <Button size="sm" variant="primary">
              Open cases for all {ring.students}
            </Button>
          </>
        }
      >
        <div className="rounded border border-line bg-[#fbfcfd]">
          <RingGraph ring={ring} />
        </div>
        <div className="mt-4 grid gap-4 text-[13px] md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Why it was flagged</div>
            <p className="mt-1 text-body">
              {ring.students} records list the same {ring.linkType.toLowerCase().replace("shared ", "")}. Genuine families rarely exceed 2–3 students on one identifier.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Other signals</div>
            <p className="mt-1 text-body">Most records lack counselling allotment matches and no student has confirmed admission.</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Suggested action</div>
            <p className="mt-1 text-body">Freeze scholarship disbursement for linked records and include them in the next physical inspection sample.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
