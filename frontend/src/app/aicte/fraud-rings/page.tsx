import { PageHeader } from "@/components/ui/primitives";
import { RingExplorer } from "./ring-explorer";

export default function FraudRingsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Fraud rings" }]}
        title="Fraud rings"
        description="Clusters of student records linked by shared identifiers such as mobile numbers, bank accounts or guardians. Agent-run ghost enrolment usually appears here before it appears anywhere else."
      />
      <RingExplorer />
    </>
  );
}
