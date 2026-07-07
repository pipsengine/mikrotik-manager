"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconName = keyof typeof Icons;

export function AppIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons[name as IconName] as LucideIcon | undefined) ?? Icons.Circle;
  return <Icon className={className ?? "h-4 w-4"} aria-hidden="true" />;
}
