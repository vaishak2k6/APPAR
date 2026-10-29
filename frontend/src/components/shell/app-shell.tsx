import Link from "next/link";
import { Bell, CircleHelp, LogOut, Search } from "lucide-react";
import { AS_OF } from "@/lib/data";
import { Brand, GovStrip } from "./brand";
import { Sidebar } from "./sidebar";
import { USERS, type Role } from "./nav";

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const user = USERS[role];
  return (
    <div className="flex min-h-screen flex-col">
      <GovStrip />
      <div className="flex flex-1">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-white lg:flex">
          <div className="flex h-14 items-center border-b border-line px-4">
            <Brand href={`/${role}`} subtitle={role === "aicte" ? "AICTE Console" : "Institution Portal"} />
          </div>
          <Sidebar role={role} />
          <div className="border-t border-line px-4 py-3 text-[11px] leading-relaxed text-faint">
            Academic year 2026–27
            <br />
            Data as of {AS_OF}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-line bg-white px-4 lg:px-6">
            <div className="lg:hidden">
              <Brand href={`/${role}`} />
            </div>
            <label className="relative hidden max-w-md flex-1 md:block">
              <span className="sr-only">Search</span>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                type="search"
                placeholder={role === "aicte" ? "Search institution, AICTE ID, case ID or last 4 of APAAR" : "Search student name or last 4 of APAAR"}
                className="h-9 w-full rounded border border-line bg-gray-50 pl-8 pr-3 text-[13px] placeholder:text-faint focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </label>
            <div className="ml-auto flex items-center gap-1">
              <button type="button" className="relative rounded p-2 text-muted hover:bg-gray-100 hover:text-ink" aria-label="Notifications">
                <Bell className="size-[18px]" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-600 ring-2 ring-white" />
              </button>
              <button type="button" className="rounded p-2 text-muted hover:bg-gray-100 hover:text-ink" aria-label="Help">
                <CircleHelp className="size-[18px]" />
              </button>
              <div className="ml-2 flex items-center gap-2.5 border-l border-line pl-3">
                <span className="grid size-8 place-items-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800">{user.initials}</span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-[13px] font-medium text-ink">{user.name}</span>
                  <span className="block text-[11px] text-muted">{user.role}</span>
                </span>
                <Link href="/" className="rounded p-2 text-muted hover:bg-gray-100 hover:text-ink" aria-label="Sign out">
                  <LogOut className="size-4" />
                </Link>
              </div>
            </div>
          </header>

          <main id="main" className="flex-1 px-4 py-6 lg:px-6">
            {children}
          </main>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-white px-4 py-3 text-[11.5px] text-faint lg:px-6">
            <span>APAAR-Satya prototype · all records shown are synthetic demo data</span>
            <span className="flex gap-4">
              <a className="hover:text-navy-700 hover:underline" href="#">Privacy notice (DPDP Act, 2023)</a>
              <a className="hover:text-navy-700 hover:underline" href="#">Accessibility</a>
              <a className="hover:text-navy-700 hover:underline" href="#">Helpdesk</a>
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
