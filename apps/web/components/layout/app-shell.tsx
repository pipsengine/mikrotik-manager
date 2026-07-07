"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/navigation/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("mikroktic-sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("mikroktic-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`transition-[padding] duration-200 ease-out ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <Topbar />
        <main className="px-4 py-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
