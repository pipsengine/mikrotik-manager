import { LockKeyhole, ShieldCheck } from "lucide-react";

export function LoginPanel({ mode }: { mode: "login" | "forgot-password" | "reset-password" }) {
  const title = mode === "login" ? "Enterprise Sign In" : mode === "forgot-password" ? "Recover Password" : "Reset Password";
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-enterprise">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-950">{title}</h1>
            <p className="text-sm font-bold text-slate-500">mikroktic-manager Zero Trust access</p>
          </div>
        </div>
        <form className="space-y-4">
          <label className="block text-sm font-extrabold text-slate-700">
            Email
            <input className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-subtle px-3 font-semibold" type="email" autoComplete="email" />
          </label>
          {mode !== "forgot-password" ? (
            <label className="block text-sm font-extrabold text-slate-700">
              Password
              <input className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-subtle px-3 font-semibold" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </label>
          ) : null}
          <div className="flex items-center justify-between text-sm font-bold text-slate-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              Remember me
            </label>
            <span>MFA ready</span>
          </div>
          <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-extrabold text-white">
            <LockKeyhole className="h-4 w-4" />
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}
