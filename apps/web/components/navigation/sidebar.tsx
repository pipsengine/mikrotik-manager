"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { moduleColors } from "@mikroktic-manager/shared";
import { sidebarConfig } from "./sidebar-config";
import { AppIcon } from "./icon-map";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-y-auto border-r border-slate-200 bg-white lg:block">
      <div className="sticky top-0 border-b border-slate-200 bg-white px-5 py-4">
        <div className="text-lg font-extrabold text-slate-950">mikroktic-manager</div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Enterprise NOC</div>
      </div>
      <nav className="space-y-5 px-3 py-4" aria-label="Primary navigation">
        {sidebarConfig.map((group) => (
          <section key={group.title} aria-labelledby={`${group.module}-heading`}>
            <div id={`${group.module}-heading`} className="mb-2 flex items-center gap-2 px-2 text-xs font-extrabold uppercase text-slate-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: moduleColors[group.module] }} />
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((entry) => {
                const active = pathname === entry.route;
                return (
                  <Link
                    key={entry.route}
                    href={entry.route}
                    className={`group flex min-h-10 items-center justify-between rounded-md px-3 py-2 text-sm font-bold transition-colors ${
                      active ? "bg-blue-50 text-primary" : "text-slate-700 hover:bg-blue-50/70 hover:text-primary"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <AppIcon name={entry.icon} className="h-4 w-4 shrink-0" />
                      <span className="truncate">{entry.title}</span>
                    </span>
                    {entry.badge ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{entry.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
