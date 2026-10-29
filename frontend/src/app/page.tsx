import Link from "next/link";
import { GovStrip, Brand } from "@/components/shell/brand";
import { SignInForm } from "./sign-in-form";

const FACTS = [
  { k: "Student-level records", v: "Every admitted student is reported against an APAAR ID, not just institution totals." },
  { k: "Independent verification", v: "Each record is checked against counselling, DigiLocker, scholarship and ABC data before it counts." },
  { k: "Seat-capped by design", v: "Uploads beyond the seats approved in the Extension of Approval are rejected at submission." },
  { k: "Consent and audit", v: "Students see who accessed their record. Every change is written to a tamper-evident log." },
];

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <GovStrip />
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Brand />
          <nav className="flex items-center gap-5 text-[13px] text-muted">
            <Link href="/verify" className="hover:text-navy-700 hover:underline">Verify a credential</Link>
            <a href="#" className="hover:text-navy-700 hover:underline">Circulars</a>
            <a href="#" className="hover:text-navy-700 hover:underline">Helpdesk</a>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_420px]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-saffron-700">AICTE · Academic year 2026–27</p>
            <h1 className="mt-3 max-w-xl text-[30px] font-semibold leading-[1.2] tracking-[-0.015em]">
              Student data management and verification for AICTE-approved institutions
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
              Institutions submit admitted-student records after counselling. AICTE monitors intake, quotas and verification status in real time, and authorised
              verifiers confirm records with the student&apos;s consent.
            </p>

            <dl className="mt-10 grid max-w-2xl gap-x-10 gap-y-6 sm:grid-cols-2">
              {FACTS.map((f) => (
                <div key={f.k} className="border-t border-line pt-3">
                  <dt className="text-[13px] font-semibold text-ink">{f.k}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-muted">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 max-w-2xl rounded-md border border-line bg-canvas px-4 py-3 text-[12.5px] text-muted">
              <span className="font-semibold text-body">Submission window: </span>
              First-year records for 2026–27 close on <span className="font-medium text-body">15 November 2026</span>. Lateral-entry records close on
              <span className="font-medium text-body"> 30 November 2026</span>.
            </div>
          </section>

          <section aria-labelledby="signin-title">
            <SignInForm />
          </section>
        </div>
      </main>

      <footer className="border-t border-line bg-canvas">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-[12px] text-faint">
          <span>Prototype built for Smart India Hackathon 2026. Not an official Government of India service.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:underline">Privacy notice</a>
            <a href="#" className="hover:underline">Terms of use</a>
            <a href="#" className="hover:underline">Accessibility statement</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
