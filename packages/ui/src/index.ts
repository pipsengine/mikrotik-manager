export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export const enterpriseCardClass = "rounded-lg border border-slate-200 bg-white shadow-enterprise";
export const enterpriseButtonClass = "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
