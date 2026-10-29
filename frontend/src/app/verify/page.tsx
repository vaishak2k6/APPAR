import Link from "next/link";
import { GovStrip, Brand } from "@/components/shell/brand";
import { VerifyForm } from "./verify-form";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <GovStrip />
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Brand href="/" subtitle="Credential verification" />
          <Link href="/" className="text-[13px] text-navy-700 hover:underline">
            Sign in
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="text-[22px] font-semibold">Verify a student credential</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-muted">
          For employers, universities, banks and regulators. Scan the QR code on a certificate or enter its credential ID. You will see only the details the
          student has chosen to share, and the student is told that you checked.
        </p>
        <VerifyForm />
      </main>
      <footer className="border-t border-line bg-white px-4 py-3 text-center text-[11.5px] text-faint">
        Verification works offline too: the QR carries a signed credential that can be checked against the AICTE public key.
      </footer>
    </div>
  );
}
