import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mikroktic-manager",
  description: "Enterprise AI-powered MikroTik Network Management Platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
