import { AppShell } from "@/components/shell/app-shell";

export default function AicteLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="aicte">{children}</AppShell>;
}
