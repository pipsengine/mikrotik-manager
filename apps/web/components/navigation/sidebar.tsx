"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { moduleColors } from "@mikroktic-manager/shared";
import { sidebarConfig } from "./sidebar-config";
import { AppIcon } from "./icon-map";

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const defaultOpenGroups = useMemo(() => Object.fromEntries(sidebarConfig.map((group) => [group.module, true])), []);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpenGroups);

  useEffect(() => {
    const saved = window.localStorage.getItem("mikroktic-sidebar-open-groups");
    if (!saved) return;

    try {
      setOpenGroups({ ...defaultOpenGroups, ...JSON.parse(saved) });
    } catch {
      setOpenGroups(defaultOpenGroups);
    }
  }, [defaultOpenGroups]);

  useEffect(() => {
    const activeGroup = sidebarConfig.find((group) => group.items.some((entry) => entry.route === pathname));
    if (!activeGroup) return;

    setOpenGroups((current) => {
      if (current[activeGroup.module]) return current;
      const next = { ...current, [activeGroup.module]: true };
      window.localStorage.setItem("mikroktic-sidebar-open-groups", JSON.stringify(next));
      return next;
    });
  }, [pathname]);

  function toggleGroup(module: string) {
    setOpenGroups((current) => {
      const next = { ...current, [module]: !current[module] };
      window.localStorage.setItem("mikroktic-sidebar-open-groups", JSON.stringify(next));
      return next;
    });
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden overflow-y-auto border-r border-slate-200 bg-white transition-[width] duration-200 ease-out lg:block ${
        collapsed ? "w-20" : "w-72"
      }`}
      data-sidebar-state={collapsed ? "collapsed" : "expanded"}
    >
      <div className={`sticky top-0 z-10 border-b border-slate-200 bg-white ${collapsed ? "px-3 py-4" : "px-4 py-4"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-3"}`}>
          <div className={collapsed ? "sr-only" : "min-w-0"}>
            <div className="truncate text-lg font-extrabold text-slate-950">mikroktic-manager</div>
            <div className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">Enterprise NOC</div>
          </div>
          {collapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-sm font-extrabold text-primary" aria-hidden="true">
              MM
            </div>
          ) : null}
          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition-colors hover:bg-blue-50 hover:text-primary ${
              collapsed ? "w-10" : "px-3"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            <span className={collapsed ? "sr-only" : ""}>Collapse</span>
          </button>
        </div>
        {!collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-slate-50 text-xs font-extrabold uppercase text-slate-600 transition-colors hover:bg-blue-50 hover:text-primary"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
            Collapse sidebar
          </button>
        ) : null}
      </div>
      <nav className={`space-y-5 py-4 ${collapsed ? "px-2" : "px-3"}`} aria-label="Primary navigation">
        {sidebarConfig.map((group) => (
          <section key={group.title} aria-labelledby={`${group.module}-heading`}>
            <button
              type="button"
              onClick={() => toggleGroup(group.module)}
              id={`${group.module}-heading`}
              className={`mb-2 flex min-h-8 w-full items-center rounded-md px-2 text-xs font-extrabold uppercase text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 ${
                collapsed ? "justify-center" : "justify-between gap-2"
              }`}
              title={collapsed ? group.title : undefined}
              aria-expanded={openGroups[group.module] ?? true}
              aria-controls={`${group.module}-items`}
            >
              <span className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-2"}`}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: moduleColors[group.module] }} />
                <span className={collapsed ? "sr-only" : "truncate"}>{group.title}</span>
              </span>
              {!collapsed ? (
                <span className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-500">{group.items.length}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openGroups[group.module] ? "rotate-0" : "-rotate-90"}`} />
                </span>
              ) : null}
            </button>
            <div
              id={`${group.module}-items`}
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                openGroups[group.module] ?? true ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-1">
                  {group.items.map((entry) => {
                    const active = pathname === entry.route;
                    return (
                      <Link
                        key={entry.route}
                        href={entry.route}
                        className={`group flex min-h-10 items-center rounded-md text-sm font-bold transition-colors ${
                          active ? "bg-blue-50 text-primary" : "text-slate-700 hover:bg-blue-50/70 hover:text-primary"
                        } ${collapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-2"}`}
                        aria-current={active ? "page" : undefined}
                        title={collapsed ? entry.title : undefined}
                      >
                        <span className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-2"}`}>
                          <AppIcon name={entry.icon} className="h-4 w-4 shrink-0" />
                          <span className={collapsed ? "sr-only" : "truncate"}>{entry.title}</span>
                        </span>
                        {entry.badge && !collapsed ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{entry.badge}</span> : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
