import Link from "next/link";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import type { Tone } from "@/lib/format";

const badgeTones: Record<Tone, string> = {
  neutral: "bg-gray-50 text-gray-700 ring-gray-300",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-700/25",
  warning: "bg-amber-50 text-amber-800 ring-amber-700/30",
  danger: "bg-red-50 text-red-800 ring-red-700/25",
  info: "bg-navy-50 text-navy-700 ring-navy-700/25",
};

export function Badge({ tone = "neutral", dot, children, className }: { tone?: Tone; dot?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset", badgeTones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

const scoreText: Record<Tone, string> = {
  success: "text-emerald-800 bg-emerald-50 ring-emerald-700/25",
  warning: "text-amber-800 bg-amber-50 ring-amber-700/30",
  danger: "text-red-800 bg-red-50 ring-red-700/25",
  info: "text-navy-700 bg-navy-50 ring-navy-700/25",
  neutral: "text-gray-700 bg-gray-50 ring-gray-300",
};

/** Fixed-width numeric chip used for Truth Score and Risk Score. */
export function ScoreChip({ value, tone, title }: { value: number; tone: Tone; title?: string }) {
  return (
    <span title={title} className={clsx("inline-flex w-9 justify-center rounded py-0.5 font-mono text-xs font-medium ring-1 ring-inset tabular", scoreText[tone])}>
      {value}
    </span>
  );
}

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const buttonVariants = {
  primary: "bg-navy-700 text-white hover:bg-navy-800 border border-navy-800",
  secondary: "bg-white text-ink border border-line-strong hover:bg-gray-50",
  ghost: "text-navy-700 hover:bg-navy-50 border border-transparent",
  danger: "bg-white text-red-700 border border-red-300 hover:bg-red-50",
  success: "bg-emerald-700 text-white border border-emerald-800 hover:bg-emerald-800",
};

export function Button({ variant = "secondary", size = "md", href, className, children, ...rest }: ButtonProps) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" ? "h-7 px-2.5 text-xs" : "h-9 px-3.5 text-[13px]",
    buttonVariants[variant],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={clsx("rounded-md border border-line bg-white", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
          <div>
            {title && <h2 className="text-[14px] font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={clsx(bodyClassName ?? "p-4")}>{children}</div>
    </section>
  );
}

export function PageHeader({
  crumbs,
  title,
  description,
  actions,
  meta,
}: {
  crumbs?: { label: string; href?: string }[];
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-muted">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3 text-faint" aria-hidden />}
              {c.href ? (
                <Link href={c.href} className="hover:text-navy-700 hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.01em]">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-[13px] text-muted">{description}</p>}
          {meta && <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/** A row of key figures inside one bordered strip, divided by hairlines. */
export function StatStrip({ items }: { items: { label: string; value: React.ReactNode; note?: React.ReactNode; tone?: Tone }[] }) {
  const noteTone: Record<Tone, string> = {
    neutral: "text-muted",
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-red-700",
    info: "text-navy-700",
  };
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3",
        items.length >= 6 ? "xl:grid-cols-6" : items.length === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4",
      )}
    >
      {items.map((it) => (
        <div key={it.label} className="bg-white px-4 py-3.5">
          <div className="text-xs font-medium text-muted">{it.label}</div>
          <div className="mt-1 text-[22px] font-semibold leading-tight text-ink tabular">{it.value}</div>
          {it.note && <div className={clsx("mt-0.5 text-xs", noteTone[it.tone ?? "neutral"])}>{it.note}</div>}
        </div>
      ))}
    </div>
  );
}

export function Meter({ value, max = 100, tone = "info", className }: { value: number; max?: number; tone?: Tone; className?: string }) {
  const fill: Record<Tone, string> = {
    neutral: "bg-gray-400",
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    danger: "bg-red-600",
    info: "bg-navy-700",
  };
  const w = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={clsx("h-1.5 w-full overflow-hidden rounded-full bg-gray-200", className)} role="meter" aria-valuenow={value} aria-valuemax={max}>
      <div className={clsx("h-full rounded-full", fill[tone])} style={{ width: `${w}%` }} />
    </div>
  );
}

export function Callout({ tone = "info", title, children, action }: { tone?: Tone; title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  const styles: Record<Tone, string> = {
    info: "border-navy-100 bg-navy-50 text-navy-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    neutral: "border-line bg-white text-ink",
  };
  return (
    <div className={clsx("flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3", styles[tone])}>
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        {children && <div className="mt-0.5 text-[13px] opacity-90">{children}</div>}
      </div>
      {action}
    </div>
  );
}

/* ---------- table primitives ---------- */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx("w-full border-collapse text-left text-[13px]", className)}>{children}</table>
    </div>
  );
}

export function TH({ children, className, align }: { children?: React.ReactNode; className?: string; align?: "right" | "center" }) {
  return (
    <th
      scope="col"
      className={clsx(
        "whitespace-nowrap border-b border-line bg-gray-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted first:pl-4 last:pr-4",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TD({ children, className, align, mono }: { children?: React.ReactNode; className?: string; align?: "right" | "center"; mono?: boolean }) {
  return (
    <td
      className={clsx(
        "border-b border-line px-3 py-2.5 align-middle first:pl-4 last:pr-4",
        align === "right" && "text-right tabular",
        align === "center" && "text-center",
        mono && "font-mono text-xs",
        className,
      )}
    >
      {children}
    </td>
  );
}
