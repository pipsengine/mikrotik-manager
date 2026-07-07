"use client";

import { Bell, Bot, CircleUserRound, Search, ShieldCheck } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 lg:px-6">
        <label className="relative flex flex-1 items-center" aria-label="Global search">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
          <input
            className="h-10 w-full rounded-md border border-slate-200 bg-subtle pl-9 pr-3 text-sm font-semibold text-slate-900 placeholder:text-slate-500"
            placeholder="Search routers, logs, users, reports, firewall rules, configuration, changes"
          />
        </label>
        <div className="hidden items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-extrabold text-emerald-700 md:flex">
          <Bot className="h-4 w-4" />
          AI online
        </div>
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>
        <button className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 sm:inline-flex" aria-label="Zero Trust status">
          <ShieldCheck className="h-4 w-4 text-success" />
          Zero Trust
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700" aria-label="Profile menu">
          <CircleUserRound className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
