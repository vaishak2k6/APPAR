import { PageHeader } from "@/components/ui/primitives";
import { ReviewWorkspace } from "./review-workspace";

export default function ReviewQueuePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Review queue" }]}
        title="Review queue"
        description="Records that did not reach agreement from three independent sources. Every decision is signed and written to the audit log; institutions can appeal within 7 days."
      />
      <ReviewWorkspace />
    </>
  );
}
