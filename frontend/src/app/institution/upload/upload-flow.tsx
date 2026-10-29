"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, FileSpreadsheet, KeyRound, UploadCloud } from "lucide-react";
import { Badge, Button, Callout, Panel, Table, TD, TH } from "@/components/ui/primitives";

const STEPS = ["Upload file", "Map columns", "Validation", "Maker review", "Checker signature"];

const COLUMNS = [
  { header: "Student Name", field: "Full name (as in APAAR)", sample: "Ananya Raghavan", ok: true },
  { header: "APAAR No", field: "APAAR ID", sample: "XXXX XXXX 4821", ok: true },
  { header: "DOB", field: "Date of birth", sample: "14-03-2008", ok: true },
  { header: "Branch Code", field: "Programme / branch", sample: "CS", ok: true },
  { header: "Adm Category", field: "Quota", sample: "GM-KCET", ok: false },
  { header: "CET Allot No", field: "Counselling allotment ID", sample: "KCET26-0091827", ok: true },
  { header: "Mobile", field: "Mobile (APAAR-registered)", sample: "98XXXXX210", ok: true },
  { header: "Nationality", field: "Nationality", sample: "Indian", ok: true },
];

const ISSUES = [
  { row: 7, student: "Mohammed Irfan Shaikh", rule: "RULE-NRI-02", code: "R-402", level: "error" as const, msg: "NRI quota selected but no NRI status evidence attached.", fix: "Attach NRI proof or change quota" },
  { row: 19, student: "Nikhil Rao", rule: "RULE-INTAKE-01", code: "R-501", level: "error" as const, msg: "CSE Regular has 108 of 108 seats used. This row cannot be accepted.", fix: "Check for a duplicate row or a wrong branch" },
  { row: 33, student: "Divya M.", rule: "RULE-DUP-04", code: "R-204", level: "error" as const, msg: "APAAR ID already active at another institution (first-year, 2026–27).", fix: "Student must surrender the other seat" },
  { row: 41, student: "Harsha Vardhan", rule: "FORMAT-APAAR", code: "F-010", level: "error" as const, msg: "APAAR ID missing.", fix: "Request APAAR generation via ABC" },
  { row: 12, student: "Arjun Nair", rule: "RULE-ELIG-03", code: "R-310", level: "warning" as const, msg: "PCM aggregate from DigiLocker is 43.2%; general-category threshold is 45%.", fix: "Upload eligibility evidence or reserved-category proof" },
  { row: 27, student: "Shreya Kulkarni", rule: "MATCH-NAME", code: "R-215", level: "warning" as const, msg: "Name differs from APAAR record (“Shreya K.”). Probable match 0.91.", fix: "Confirm spelling against APAAR" },
  { row: 58, student: "Farhan Ali", rule: "MATCH-ALLOT", code: "R-101", level: "warning" as const, msg: "Allotment number not found in KCET round-2 list yet.", fix: "Will re-check after round-3 data is received" },
];

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-2 rounded-md border border-line bg-white px-4 py-3">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center">
            <span className="flex items-center gap-2">
              <span
                className={clsx(
                  "grid size-6 place-items-center rounded-full text-xs font-semibold",
                  done ? "bg-navy-700 text-white" : active ? "border-2 border-navy-700 text-navy-700" : "border border-line-strong text-faint",
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
              </span>
              <span className={clsx("text-[13px]", active ? "font-semibold text-ink" : done ? "text-body" : "text-faint")}>{label}</span>
            </span>
            {i < STEPS.length - 1 && <span className="mx-3 h-px w-8 bg-line-strong" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

export function UploadFlow() {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [quotaMapped, setQuotaMapped] = useState(false);
  const [signed, setSigned] = useState(false);

  const errors = ISSUES.filter((i) => i.level === "error").length;
  const warnings = ISSUES.length - errors;

  return (
    <div className="space-y-5">
      <Stepper step={signed ? 5 : step} />

      {step === 0 && (
        <Panel title="Upload file" description="Excel (.xlsx) or CSV, one row per admitted student. Up to 5,000 rows per batch.">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-line-strong bg-gray-50 px-6 py-12 text-center hover:border-navy-600 hover:bg-navy-50/40">
            <UploadCloud className="size-8 text-faint" aria-hidden />
            <span className="mt-3 text-[14px] font-medium text-ink">Drag a file here or choose from your computer</span>
            <span className="mt-1 text-xs text-muted">Rows are validated in your browser first; nothing is sent until you submit.</span>
            <input type="file" accept=".xlsx,.csv" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
          </label>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[13px]">
              <Button size="sm" variant="ghost" onClick={() => setFileName("kce_admissions_2026_batch2.xlsx")}>
                Use sample file
              </Button>
              <a href="#" className="text-xs text-navy-700 hover:underline">
                Download template (.xlsx)
              </a>
              <a href="#" className="text-xs text-navy-700 hover:underline">
                Field guide
              </a>
            </div>
            {fileName && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded border border-line bg-white px-3 py-1.5 text-[13px]">
                  <FileSpreadsheet className="size-4 text-emerald-700" aria-hidden />
                  {fileName}
                  <span className="text-xs text-muted">64 rows</span>
                </span>
                <Button variant="primary" onClick={() => setStep(1)}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        </Panel>
      )}

      {step === 1 && (
        <Panel title="Map columns" description="Match your file's headers to the AICTE schema. Your mapping is saved for future batches.">
          <Table>
            <thead>
              <tr>
                <TH>Column in your file</TH>
                <TH>Sample value</TH>
                <TH>AICTE field</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {COLUMNS.map((c) => {
                const ok = c.ok || quotaMapped;
                return (
                  <tr key={c.header}>
                    <TD className="font-medium text-ink">{c.header}</TD>
                    <TD mono className="text-muted">
                      {c.sample}
                    </TD>
                    <TD>
                      {c.ok ? (
                        <span className="text-[13px] text-body">{c.field}</span>
                      ) : (
                        <select
                          className="h-8 rounded border border-amber-400 bg-white px-2 text-[13px] focus:border-navy-600 focus:outline-none"
                          defaultValue=""
                          onChange={() => setQuotaMapped(true)}
                        >
                          <option value="" disabled>
                            Map values for “{c.header}”…
                          </option>
                          <option>GM-KCET → Regular</option>
                          <option>TFW → TFWS</option>
                          <option>NRI → NRI</option>
                        </select>
                      )}
                    </TD>
                    <TD>{ok ? <Badge tone="success">Mapped</Badge> : <Badge tone="warning">Needs mapping</Badge>}</TD>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => setStep(0)}>Back</Button>
            <Button variant="primary" disabled={!quotaMapped} onClick={() => setStep(2)}>
              Run validation
            </Button>
          </div>
        </Panel>
      )}

      {step === 2 && (
        <>
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
            {[
              { k: "Rows checked", v: 64, c: "text-ink" },
              { k: "Ready", v: 64 - ISSUES.length, c: "text-emerald-700" },
              { k: "Errors (blocked)", v: errors, c: "text-red-700" },
              { k: "Warnings (can submit)", v: warnings, c: "text-amber-700" },
            ].map((x) => (
              <div key={x.k} className="bg-white px-4 py-3">
                <div className="text-xs text-muted">{x.k}</div>
                <div className={clsx("text-[22px] font-semibold tabular", x.c)}>{x.v}</div>
              </div>
            ))}
          </div>
          <Panel title="Validation results" description="Each issue cites the rule that raised it. Rows with errors are excluded from this batch until fixed." bodyClassName="p-0">
            <Table>
              <thead>
                <tr>
                  <TH align="right">Row</TH>
                  <TH>Student</TH>
                  <TH>Level</TH>
                  <TH>Rule</TH>
                  <TH>What we found</TH>
                  <TH>How to fix</TH>
                </tr>
              </thead>
              <tbody>
                {ISSUES.map((i) => (
                  <tr key={i.row} className="align-top">
                    <TD align="right" mono>
                      {i.row}
                    </TD>
                    <TD className="whitespace-nowrap font-medium text-ink">{i.student}</TD>
                    <TD>{i.level === "error" ? <Badge tone="danger">Error</Badge> : <Badge tone="warning">Warning</Badge>}</TD>
                    <TD className="whitespace-nowrap">
                      <div className="font-mono text-[11px] text-ink">{i.rule}</div>
                      <div className="font-mono text-[11px] text-faint">{i.code}</div>
                    </TD>
                    <TD className="max-w-md text-body">{i.msg}</TD>
                    <TD className="text-muted">{i.fix}</TD>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
              <Button onClick={() => setStep(1)}>Back</Button>
              <div className="flex gap-2">
                <Button>Download error report</Button>
                <Button variant="primary" onClick={() => setStep(3)}>
                  Continue with {64 - errors} rows
                </Button>
              </div>
            </div>
          </Panel>
        </>
      )}

      {step === 3 && (
        <Panel title="Maker review" description="Confirm the batch before sending it to your checker.">
          <dl className="grid gap-x-8 gap-y-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Batch", "2026–27 · Batch 2"],
              ["Rows in batch", `${64 - errors} (of 64)`],
              ["Seats it will consume", `${64 - errors} across 6 branches`],
              ["Excluded rows", `${errors} (errors to fix)`],
              ["Prepared by", "Prakash Hegde, Admissions Officer"],
              ["Checker", "Dr. S. Ramaswamy, Principal"],
              ["Student notifications", "Sent after checker signs"],
              ["File hash (SHA-256)", "3be1…9c04"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <label className="mt-5 flex items-start gap-2 text-[13px] text-body">
            <input type="checkbox" defaultChecked className="mt-0.5 accent-navy-700" />I confirm these students have been admitted against seats approved for 2026–27 and the
            details match institutional records.
          </label>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => setStep(2)}>Back</Button>
            <Button variant="primary" onClick={() => setStep(4)}>
              Send to checker
            </Button>
          </div>
        </Panel>
      )}

      {step === 4 && (
        <Panel title="Checker signature" description="The Registrar or Principal signs the batch. The signature is legally binding under the IT Act, 2000.">
          {signed ? (
            <Callout tone="success" title={`Batch 2 signed and submitted · ${64 - errors} records`}>
              Seats consumed in the ledger. Students will receive confirmation requests on DigiLocker, SMS and IVR. Receipt ID SUB-26-KCE-0002.
            </Callout>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { t: "Aadhaar eSign", d: "OTP to the checker's Aadhaar-linked mobile through a licensed eSign provider." },
                  { t: "Digital Signature Certificate", d: "Class 3 DSC on a USB token. Requires the signing utility." },
                ].map((o, i) => (
                  <label key={o.t} className="flex cursor-pointer items-start gap-3 rounded border border-line px-4 py-3 hover:border-line-strong">
                    <input type="radio" name="sig" defaultChecked={i === 0} className="mt-1 accent-navy-700" />
                    <span>
                      <span className="block text-[13px] font-medium text-ink">{o.t}</span>
                      <span className="block text-xs text-muted">{o.d}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <Button onClick={() => setStep(3)}>Back</Button>
                <Button variant="primary" onClick={() => setSigned(true)}>
                  <KeyRound className="size-4" aria-hidden />
                  Sign and submit to AICTE
                </Button>
              </div>
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
