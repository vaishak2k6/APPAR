"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, ChevronRight, Eye, FileBadge, Share2, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge, Button } from "@/components/ui/primitives";
import { QrPlaceholder } from "@/components/qr-placeholder";

const ACCESS = [
  { who: "Kaveri College of Engineering", why: "Submitted your admission record", when: "29 Oct 2026, 09:12", consent: "Statutory (admission)", active: true },
  { who: "State Scholarship Portal (NSP)", why: "Checked enrolment for post-matric scholarship", when: "27 Oct 2026, 14:03", consent: "Consent C-2291", active: true },
  { who: "Education loan lender, Mysuru branch", why: "Verified bonafide certificate for education loan", when: "21 Oct 2026, 11:40", consent: "Consent C-2214 · expires 21 Nov", active: true },
];

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("rounded-md border border-line bg-white", className)}>{children}</section>;
}

export function StudentHome() {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [revoked, setRevoked] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] text-muted">Namaste,</p>
        <h1 className="text-[20px] font-semibold">Ananya Raghavan</h1>
        <p className="font-mono text-xs text-muted">APAAR ID XXXX XXXX 4821</p>
      </div>

      {answer === null ? (
        <Card className="border-navy-700">
          <div className="border-b border-line bg-navy-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.05em] text-navy-800">Action needed</div>
          <div className="px-4 py-4">
            <h2 className="text-[15px] font-semibold">Did you take admission at this college?</h2>
            <dl className="mt-3 grid grid-cols-[110px_1fr] gap-y-1.5 text-[13px]">
              <dt className="text-muted">College</dt>
              <dd className="font-medium text-ink">Kaveri College of Engineering, Mysuru</dd>
              <dt className="text-muted">Programme</dt>
              <dd className="text-ink">B.E. Computer Science & Engineering</dd>
              <dt className="text-muted">Year / session</dt>
              <dd className="text-ink">First year · 2026–27</dd>
              <dt className="text-muted">Seat type</dt>
              <dd className="text-ink">Regular (KCET allotment)</dd>
            </dl>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button variant="primary" onClick={() => setAnswer("yes")}>
                Yes, I joined this college
              </Button>
              <Button variant="danger" onClick={() => setAnswer("no")}>
                No, I did not join
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">Your answer is recorded with an OTP. If you did not join, AICTE reviews the college&apos;s record and your APAAR ID stays free.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex items-start gap-3 px-4 py-4">
            {answer === "yes" ? <Check className="mt-0.5 size-5 text-emerald-700" aria-hidden /> : <TriangleAlert className="mt-0.5 size-5 text-red-700" aria-hidden />}
            <div>
              <h2 className="text-[14px] font-semibold">{answer === "yes" ? "Admission confirmed" : "Reported: you did not join"}</h2>
              <p className="mt-0.5 text-[13px] text-muted">
                {answer === "yes"
                  ? "Thank you. Your record now has four matching sources and is marked Verified."
                  : "A review case has been opened (CASE-26-01588). You will get an SMS when it is resolved."}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[14px] font-semibold">My admission record</h2>
          <Badge tone={answer === "yes" ? "success" : "warning"} dot>
            {answer === "yes" ? "Verified" : "Awaiting your confirmation"}
          </Badge>
        </div>
        <ul className="divide-y divide-line text-[13px]">
          {[
            { k: "Institution upload", v: "Signed by Principal, 27 Oct", ok: true },
            { k: "KCET allotment", v: "Round 2 · CSE · matched", ok: true },
            { k: "Class 12 marks (DigiLocker)", v: "Eligibility met", ok: true },
            { k: "Your confirmation", v: answer === "yes" ? "Confirmed today" : "Pending", ok: answer === "yes" },
          ].map((r) => (
            <li key={r.k} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-body">{r.k}</span>
              <span className={clsx("flex items-center gap-1.5 text-xs", r.ok ? "text-emerald-700" : "text-amber-700")}>
                {r.ok && <Check className="size-3.5" aria-hidden />}
                {r.v}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 py-2.5 text-xs">
          <a href="#" className="text-navy-700 hover:underline">
            Something is wrong in my record
          </a>
          <a href="#" className="text-navy-700 hover:underline">
            Surrender this seat
          </a>
        </div>
      </Card>

      <Card>
        <div className="border-b border-line px-4 py-3">
          <h2 className="text-[14px] font-semibold">My documents</h2>
        </div>
        <div className="flex gap-4 px-4 py-4">
          <div className="rounded border border-line p-1.5">
            <QrPlaceholder seed="VC-2026-KCE-004821" size={96} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FileBadge className="size-4 text-navy-700" aria-hidden />
              <span className="text-[13px] font-semibold text-ink">Bonafide certificate</span>
            </div>
            <p className="mt-0.5 text-xs text-muted">Signed by the college and AICTE. Anyone can verify it by scanning the code; they see only what you choose to share.</p>
            <p className="mt-1 font-mono text-[11px] text-faint">VC-2026-KCE-004821</p>
            <div className="mt-2.5 flex gap-2">
              <Button size="sm" variant="primary">
                <Share2 className="size-3.5" aria-hidden />
                Share
              </Button>
              <Button size="sm">Save to DigiLocker</Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[13px] text-muted">
          <span>Degree certificate</span>
          <span className="text-xs">Issued after graduation (2030)</span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold">
            <Eye className="size-4 text-faint" aria-hidden />
            Who viewed my record
          </h2>
          <span className="text-xs text-muted">Last 30 days</span>
        </div>
        <ul className="divide-y divide-line">
          {ACCESS.map((a) => {
            const isRevoked = revoked.includes(a.who);
            const statutory = a.consent.startsWith("Statutory");
            return (
              <li key={a.who} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-ink">{a.who}</div>
                    <div className="text-xs text-muted">{a.why}</div>
                    <div className="mt-0.5 text-[11.5px] text-faint">
                      {a.when} · {a.consent}
                    </div>
                  </div>
                  {statutory ? (
                    <span className="shrink-0 text-[11.5px] text-faint">Required by law</span>
                  ) : isRevoked ? (
                    <Badge>Revoked</Badge>
                  ) : (
                    <Button size="sm" variant="danger" onClick={() => setRevoked((r) => [...r, a.who])}>
                      Revoke
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <a href="#" className="flex items-center justify-between rounded-md border border-line bg-white px-4 py-3 text-[13px] hover:bg-gray-50">
        <span className="flex items-center gap-2 text-body">
          <ShieldCheck className="size-4 text-faint" aria-hidden />
          Report a college using my name without consent
        </span>
        <ChevronRight className="size-4 text-faint" aria-hidden />
      </a>

      <p className="pb-6 text-center text-[11.5px] text-faint">Need help? Call 1800-XXX-XXXX (toll free) or press 2 for Hindi, 3 for Kannada.</p>
    </div>
  );
}
