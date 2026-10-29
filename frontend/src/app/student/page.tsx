import { GovStrip, Brand } from "@/components/shell/brand";
import { StudentHome } from "./student-home";

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <GovStrip />
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Brand href="/student" subtitle="My academic record" />
          <span className="grid size-8 place-items-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800">AR</span>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-2xl px-4 py-6">
        <StudentHome />
      </main>
    </div>
  );
}
