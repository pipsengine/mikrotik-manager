"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { findNavigationItem } from "@mikroktic-manager/shared";

export function Breadcrumbs() {
  const pathname = usePathname();
  const item = findNavigationItem(pathname);
  const crumbs = item?.breadcrumb ?? ["Home"];

  return (
    <nav className="flex items-center gap-1 text-sm font-bold text-slate-500" aria-label="Breadcrumb">
      <Home className="h-4 w-4" />
      {crumbs.slice(1).map((crumb) => (
        <span key={crumb} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">{crumb}</span>
        </span>
      ))}
    </nav>
  );
}
