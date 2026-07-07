import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        primary: "#2563EB",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        purple: "#7C3AED",
        orange: "#EA580C",
        cyan: "#06B6D4",
        slateEnterprise: "#475569",
        canvas: "#FFFFFF",
        subtle: "#F8FAFC"
      },
      boxShadow: {
        enterprise: "0 1px 2px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
