import Link from "next/link";
import clsx from "clsx";
import { Download, ArrowUpRight } from "lucide-react";
import { Badge, Button, Meter, PageHeader, Panel, ScoreChip, StatStrip, Table, TD, TH } from "@/components/ui/primitives";
import { ACADEMIC_YEAR, ALERTS, AS_OF, INSTITUTIONS, NATIONAL_KPIS as K, reasonByCode, SOURCE_MATCH_RATES, SOURCES, STATES } from "@/lib/data";
import { inr, pct, ratio, riskTone } from "@/lib/format";

export default function NationalOverview() {
  const highRisk = [...INSTITUTIONS].filter((i) => i.risk > 0).sort((a, b) => b.risk - a.risk).slice(0, 6);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console" }, { label: "National overview" }]}
        title="National overview"
        description={`Admitted-student records submitted by AICTE-approved institutions for ${ACADEMIC_YEAR}. Figures refresh every 15 minutes.`}
        meta={
          <>
            <Badge tone="info">First-year submission window open · closes 15 Nov 2026</Badge>
            <span className="text-xs text-faint">As of {AS_OF}</span>
          </>
        }
        actions={
          <>
            <Button href="/aicte/reports">
              <Download className="size-4" aria-hidden />
              Export
            </Button>
            <Button variant="primary" href="/aicte/review">Open review queue</Button>
          </>
        }
      />

      <StatStrip
        items={[
          { label: "Institutions reporting", value: inr(K.institutionsReporting), note: `of ${inr(K.institutionsTotal)} · ${pct(ratio(K.institutionsReporting, K.institutionsTotal))}` },
          { label: "Student records received", value: inr(K.records), note: "+38,204 in last 24 h", tone: "info" },
          { label: "Verified (3+ sources)", value: inr(K.verified), note: pct(ratio(K.verified, K.records)), tone: "success" },
          { label: "Under review", value: inr(K.underReview), note: pct(ratio(K.underReview, K.records)), tone: "warning" },
          { label: "Flagged", value: inr(K.flagged), note: pct(ratio(K.flagged, K.records)), tone: "danger" },
          { label: "Over-intake uploads blocked", value: inr(K.blockedOverIntake), note: "rejected at submission", tone: "neutral" },
        ]}
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel
          title="Admissions and verification by state"
          description="Top 10 states by approved intake"
          actions={<Button size="sm" variant="ghost" href="/aicte/institutions">All institutions</Button>}
          bodyClassName="p-0"
        >
          <Table>
            <thead>
              <tr>
                <TH>State</TH>
                <TH align="right">Institutions</TH>
                <TH align="right">Approved intake</TH>
                <TH align="right">Admitted</TH>
                <TH className="w-44">Fill rate</TH>
                <TH className="w-44">Verified</TH>
              </tr>
            </thead>
            <tbody>
              {STATES.map((s) => {
                const fill = ratio(s.admitted, s.approved);
                return (
                  <tr key={s.state} className="hover:bg-gray-50">
                    <TD className="whitespace-nowrap font-medium text-ink">{s.state}</TD>
                    <TD align="right">{inr(s.institutions)}</TD>
                    <TD align="right">{inr(s.approved)}</TD>
                    <TD align="right">{inr(s.admitted)}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Meter value={fill} tone="info" className="w-24" />
                        <span className="text-xs tabular text-muted">{pct(fill)}</span>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Meter value={s.verified} tone={s.verified >= 85 ? "success" : s.verified >= 75 ? "warning" : "danger"} className="w-24" />
                        <span className="text-xs tabular text-muted">{pct(s.verified)}</span>
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>

        <Panel title="Alerts" description="Raised by rule, graph and report engines" bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {ALERTS.map((a) => (
              <li key={a.text}>
                <Link href={a.href} className="flex gap-3 px-4 py-3 hover:bg-gray-50">
                  <span
                    className={clsx(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      a.severity === "high" ? "bg-red-600" : a.severity === "medium" ? "bg-amber-500" : "bg-gray-400",
                    )}
                    aria-label={`${a.severity} severity`}
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-snug text-body">{a.text}</span>
                    <span className="mt-1 block text-[11.5px] text-faint">{a.time}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel
          title="Institutions with the highest risk score"
          description="Risk combines Truth Score averages, open flags, fraud-ring links and upload behaviour"
          bodyClassName="p-0"
        >
          <Table>
            <thead>
              <tr>
                <TH>Institution</TH>
                <TH>State</TH>
                <TH align="right">Admitted / approved</TH>
                <TH align="right">Flags</TH>
                <TH>Main reason</TH>
                <TH align="center">Risk</TH>
                <TH />
              </tr>
            </thead>
            <tbody>
              {highRisk.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <TD>
                    <Link href={`/aicte/institutions/${i.id}`} className="font-medium text-navy-700 hover:underline">
                      {i.name}
                    </Link>
                    <div className="font-mono text-[11px] text-faint">{i.aicteId}</div>
                  </TD>
                  <TD className="text-muted">{i.state}</TD>
                  <TD align="right" className={clsx(i.admitted > i.approvedIntake && "font-semibold text-red-700")}>
                    {i.admitted} / {i.approvedIntake}
                  </TD>
                  <TD align="right">{i.flagged}</TD>
                  <TD className="text-muted">
                    <span className="font-mono text-[11px] text-faint">{i.topReason}</span> {reasonByCode[i.topReason]?.label}
                  </TD>
                  <TD align="center">
                    <ScoreChip value={i.risk} tone={riskTone(i.risk)} />
                  </TD>
                  <TD align="right">
                    <Link href={`/aicte/institutions/${i.id}`} aria-label={`Open ${i.name}`} className="text-faint hover:text-navy-700">
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </TD>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>

        <Panel title="Match rate by verification source" description="Share of submitted records each source has confirmed">
          <ul className="space-y-3.5">
            {SOURCES.map((s) => {
              const v = SOURCE_MATCH_RATES[s.key];
              return (
                <li key={s.key}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-body">{s.label}</span>
                    <span className="font-medium tabular text-ink">{pct(v)}</span>
                  </div>
                  <Meter value={v} tone="info" />
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
            A record is <span className="font-medium text-emerald-700">Verified</span> when at least three independent sources agree with the institution&apos;s upload.
          </p>
        </Panel>
      </div>
    </>
  );
}
