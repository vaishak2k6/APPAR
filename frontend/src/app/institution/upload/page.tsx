import { PageHeader } from "@/components/ui/primitives";
import { UploadFlow } from "./upload-flow";

export default function UploadPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Institution Portal", href: "/institution" }, { label: "Submit records" }]}
        title="Submit student records"
        description="Upload admitted students for 2026–27. Records are checked against your minted seats, handbook rules and national duplicates before the checker signs the batch."
      />
      <UploadFlow />
    </>
  );
}
