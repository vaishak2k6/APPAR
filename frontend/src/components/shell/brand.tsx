import Link from "next/link";
import clsx from "clsx";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={clsx("grid size-8 shrink-0 place-items-center rounded-[3px] bg-navy-800 text-[12px] font-bold tracking-wide text-white", className)} aria-hidden>
      AS
    </span>
  );
}

export function Brand({ href = "/", subtitle = "Student Record Verification" }: { href?: string; subtitle?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <BrandMark />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold text-ink">APAAR-Satya</span>
        <span className="block text-[11px] text-muted">{subtitle}</span>
      </span>
    </Link>
  );
}

/** Government identity strip shown above every screen. */
export function GovStrip() {
  return (
    <div className="bg-navy-950 text-[11.5px] text-navy-100">
      <div className="mx-auto flex h-8 items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-2 truncate">
          <span>Government of India</span>
          <span className="text-navy-600" aria-hidden>|</span>
          <span className="truncate">Ministry of Education · All India Council for Technical Education</span>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <a href="#main" className="hover:text-white hover:underline">Skip to main content</a>
          <span className="text-navy-600" aria-hidden>|</span>
          <span className="flex items-center gap-1" aria-label="Text size">
            <button className="px-1 hover:text-white" type="button">A-</button>
            <button className="px-1 hover:text-white" type="button">A</button>
            <button className="px-1 hover:text-white" type="button">A+</button>
          </span>
          <span className="text-navy-600" aria-hidden>|</span>
          <span>
            <button className="font-semibold text-white" type="button">English</button>
            <span className="px-1 text-navy-600">/</span>
            <button className="hover:text-white" type="button">हिन्दी</button>
          </span>
          <span className="rounded-sm border border-saffron-600/60 px-1.5 py-px text-[10.5px] font-medium uppercase tracking-wide text-saffron-100">Prototype · SIH 2026</span>
        </div>
      </div>
    </div>
  );
}
