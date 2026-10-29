"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Lock } from "lucide-react";

const ROLES = [
  { id: "aicte", label: "AICTE officer", hint: "Approval bureau, regional office, review cell", dest: "/aicte", sso: "Sign in with Parichay (NIC)" },
  { id: "institution", label: "Institution user", hint: "Admissions maker or registrar / principal checker", dest: "/institution", sso: null },
  { id: "student", label: "Student", hint: "Confirm admission, view record, share credentials", dest: "/student", sso: "Continue with DigiLocker" },
  { id: "verifier", label: "Verifier", hint: "Employer, regulator or university checking a credential", dest: "/verify", sso: null },
] as const;

export function SignInForm() {
  const router = useRouter();
  const [role, setRole] = useState<(typeof ROLES)[number]["id"]>("aicte");
  const current = ROLES.find((r) => r.id === role)!;

  return (
    <form
      className="rounded-md border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(current.dest);
      }}
    >
      <div className="border-b border-line px-6 py-4">
        <h2 id="signin-title" className="text-[16px] font-semibold">Sign in</h2>
        <p className="mt-0.5 text-[12.5px] text-muted">Select how you use the platform.</p>
      </div>

      <fieldset className="space-y-2 px-6 pt-5">
        <legend className="sr-only">Account type</legend>
        {ROLES.map((r) => (
          <label
            key={r.id}
            className={clsx(
              "flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5",
              role === r.id ? "border-navy-700 bg-navy-50" : "border-line hover:border-line-strong",
            )}
          >
            <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} className="mt-0.5 accent-navy-700" />
            <span>
              <span className="block text-[13px] font-medium text-ink">{r.label}</span>
              <span className="block text-[12px] text-muted">{r.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {role !== "verifier" && (
        <div className="space-y-3 px-6 pt-5">
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink">{role === "institution" ? "AICTE permanent ID / user ID" : role === "student" ? "APAAR ID or mobile number" : "Official email ID"}</span>
            <input className="mt-1 h-9 w-full rounded border border-line-strong px-3 text-[13px] focus:border-navy-600 focus:outline-none" autoComplete="username" />
          </label>
          {role !== "student" && (
            <label className="block">
              <span className="text-[12.5px] font-medium text-ink">Password</span>
              <input type="password" className="mt-1 h-9 w-full rounded border border-line-strong px-3 text-[13px] focus:border-navy-600 focus:outline-none" autoComplete="current-password" />
            </label>
          )}
        </div>
      )}

      <div className="space-y-2 px-6 py-5">
        <button type="submit" className="flex h-9 w-full items-center justify-center gap-2 rounded border border-navy-800 bg-navy-700 text-[13px] font-medium text-white hover:bg-navy-800">
          <Lock className="size-3.5" aria-hidden />
          {role === "verifier" ? "Go to credential verification" : role === "student" ? "Send OTP" : "Sign in"}
        </button>
        {current.sso && (
          <button type="submit" className="h-9 w-full rounded border border-line-strong bg-white text-[13px] font-medium text-ink hover:bg-gray-50">
            {current.sso}
          </button>
        )}
        <p className="pt-1 text-center text-[11.5px] text-faint">Demo build: any input signs you in.</p>
      </div>
    </form>
  );
}
