"use client";

import { useState } from "react";
import { BadgeCheck, EyeOff, QrCode, Search } from "lucide-react";
import { Button } from "@/components/ui/primitives";

const DISCLOSED = [
  ["Name", "Ananya Raghavan"],
  ["Programme", "B.E. Computer Science & Engineering"],
  ["Institution", "Kaveri College of Engineering, Mysuru"],
  ["AICTE permanent ID", "1-2814437"],
  ["Status", "Enrolled, first year, 2026–27"],
  ["Admitted against", "An AICTE-approved seat"],
];

const WITHHELD = ["Date of birth", "Category / caste", "Quota and fee waiver", "Marks", "Full APAAR ID"];

export function VerifyForm() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<"ok" | "notfound" | null>(null);

  return (
    <div className="mt-6 space-y-5">
      <form
        className="flex flex-wrap gap-2 rounded-md border border-line bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(id.trim().toUpperCase() === "VC-2026-KCE-004821" ? "ok" : "notfound");
        }}
      >
        <label className="min-w-64 flex-1">
          <span className="sr-only">Credential ID</span>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Credential ID, e.g. VC-2026-KCE-004821"
            className="h-10 w-full rounded border border-line-strong px-3 font-mono text-[13px] focus:border-navy-600 focus:outline-none"
          />
        </label>
        <Button type="submit" variant="primary" className="h-10">
          <Search className="size-4" aria-hidden />
          Verify
        </Button>
        <Button className="h-10" onClick={() => { setId("VC-2026-KCE-004821"); setResult("ok"); }}>
          <QrCode className="size-4" aria-hidden />
          Scan QR
        </Button>
      </form>

      {result === "notfound" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-900">
          <span className="font-semibold">No valid credential found.</span> Check the ID, or ask the student to share a fresh link. Try{" "}
          <button type="button" className="font-mono underline" onClick={() => { setId("VC-2026-KCE-004821"); setResult("ok"); }}>
            VC-2026-KCE-004821
          </button>
          .
        </div>
      )}

      {result === "ok" && (
        <section className="overflow-hidden rounded-md border border-emerald-300 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 bg-emerald-50 px-5 py-3">
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="size-6 text-emerald-700" aria-hidden />
              <div>
                <div className="text-[15px] font-semibold text-emerald-900">Credential is authentic</div>
                <div className="text-xs text-emerald-800">Signatures valid · not revoked · issued 27 Oct 2026</div>
              </div>
            </div>
            <span className="font-mono text-xs text-emerald-900">VC-2026-KCE-004821</span>
          </div>
          <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_260px]">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Shared by the student</h2>
              <dl className="mt-2 divide-y divide-line rounded border border-line">
                {DISCLOSED.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[160px_1fr] gap-3 px-3 py-2 text-[13px]">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Not shared</h2>
                <ul className="mt-2 space-y-1.5">
                  {WITHHELD.map((w) => (
                    <li key={w} className="flex items-center gap-2 text-[13px] text-muted">
                      <EyeOff className="size-3.5 text-faint" aria-hidden />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded border border-line bg-gray-50 px-3 py-2.5 text-xs text-muted">
                <div className="font-semibold text-body">Signed by</div>
                Kaveri College of Engineering (issuer)
                <br />
                AICTE (seat attestation)
              </div>
            </div>
          </div>
          <div className="border-t border-line bg-gray-50 px-5 py-2.5 text-[11.5px] text-muted">
            Verification reference VR-26-889120 · logged to the student&apos;s access history.
          </div>
        </section>
      )}
    </div>
  );
}
