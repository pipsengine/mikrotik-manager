import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/navigation/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="px-4 py-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
