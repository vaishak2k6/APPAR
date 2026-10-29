import { Plus } from "lucide-react";
import { Button, PageHeader } from "@/components/ui/primitives";
import { PolicyWorkspace } from "./policy-workspace";

export default function PolicyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "AICTE Console", href: "/aicte" }, { label: "Policy rules" }]}
        title="Policy rules"
        description="Approval handbook norms stored as versioned, machine-readable rules. Every rejection or flag in the platform cites the rule and version that produced it."
        actions={
          <Button variant="primary">
            <Plus className="size-4" aria-hidden />
            New rule draft
          </Button>
        }
      />
      <PolicyWorkspace />
    </>
  );
}
