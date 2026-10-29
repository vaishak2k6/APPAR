"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV, type Role } from "./nav";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const base = `/${role}`;
  const isActive = (href: string) => (href === base ? pathname === base : pathname === href || pathname.startsWith(href + "/"));

  return (
    <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
      {NAV[role].map((group) => (
        <div key={group.heading} className="mb-5">
          <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">{group.heading}</div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-2.5 rounded px-2 py-1.5 text-[13px] transition-colors",
                      active ? "bg-navy-50 font-semibold text-navy-800" : "text-body hover:bg-gray-100 hover:text-ink",
                    )}
                  >
                    <Icon className={clsx("size-4", active ? "text-navy-700" : "text-faint")} aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    {item.count !== undefined && (
                      <span className={clsx("rounded px-1.5 text-[11px] font-semibold tabular", active ? "bg-navy-700 text-white" : "bg-gray-200 text-body")}>{item.count}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
