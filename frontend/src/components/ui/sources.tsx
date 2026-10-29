import clsx from "clsx";
import { Check, Clock3, Minus, X } from "lucide-react";
import { SOURCES } from "@/lib/data";
import type { SourceKey, SourceResult } from "@/lib/types";

const cell: Record<SourceResult, string> = {
  match: "bg-emerald-600",
  mismatch: "bg-red-600",
  pending: "bg-amber-400",
  na: "bg-gray-200",
};

const word: Record<SourceResult, string> = {
  match: "matched",
  mismatch: "mismatch",
  pending: "pending",
  na: "not applicable",
};

/** Six small cells, one per verification source, in a fixed order. */
export function SourceCells({ sources }: { sources: Record<SourceKey, SourceResult> }) {
  return (
    <div className="flex gap-0.5" aria-label="Verification sources">
      {SOURCES.map((s) => (
        <span key={s.key} title={`${s.short}: ${word[sources[s.key]]}`} className={clsx("h-3.5 w-2.5 rounded-[2px]", cell[sources[s.key]])} />
      ))}
    </div>
  );
}

const icon: Record<SourceResult, React.ReactNode> = {
  match: <Check className="size-3.5 text-emerald-700" aria-hidden />,
  mismatch: <X className="size-3.5 text-red-700" aria-hidden />,
  pending: <Clock3 className="size-3.5 text-amber-700" aria-hidden />,
  na: <Minus className="size-3.5 text-faint" aria-hidden />,
};

const resultText: Record<SourceResult, string> = {
  match: "Matched",
  mismatch: "Mismatch",
  pending: "Awaiting",
  na: "Not applicable",
};

/** Full checklist of the six sources with their result. */
export function SourceList({ sources }: { sources: Record<SourceKey, SourceResult> }) {
  return (
    <ul className="divide-y divide-line rounded border border-line">
      {SOURCES.map((s) => (
        <li key={s.key} className="flex items-center justify-between gap-3 px-3 py-2 text-[13px]">
          <span className="flex items-center gap-2">
            {icon[sources[s.key]]}
            {s.label}
          </span>
          <span
            className={clsx(
              "text-xs font-medium",
              sources[s.key] === "match" && "text-emerald-700",
              sources[s.key] === "mismatch" && "text-red-700",
              sources[s.key] === "pending" && "text-amber-700",
              sources[s.key] === "na" && "text-faint",
            )}
          >
            {resultText[sources[s.key]]}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SourceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
      {(["match", "mismatch", "pending", "na"] as SourceResult[]).map((r) => (
        <span key={r} className="flex items-center gap-1.5">
          <span className={clsx("h-3 w-2 rounded-[2px]", cell[r])} />
          {resultText[r]}
        </span>
      ))}
      <span className="text-faint">Order: {SOURCES.map((s) => s.short).join(" · ")}</span>
    </div>
  );
}
