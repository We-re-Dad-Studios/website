"use client";

import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRoyalRoadLink } from "@/lib/royal-road";

type Variant = "solid" | "outline" | "ghost" | "link";

const base =
  "group inline-flex items-center gap-2 font-semibold transition-all duration-300";

const variantClasses: Record<Variant, string> = {
  solid:
    "justify-center rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 bg-[#3b6ea5] hover:bg-[#345f8f] text-white shadow-sm hover:shadow-[0_0_24px_rgba(59,110,165,0.35)]",
  outline:
    "justify-center rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 border border-white/20 hover:border-white/40 text-white hover:bg-white/5",
  ghost:
    "justify-center rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 text-white/70 hover:text-white hover:bg-white/5",
  link: "text-sm text-[#6fa3d6] hover:text-[#8bb8e2] underline-offset-4 hover:underline",
};

export function RoyalRoadButton({
  slug,
  variant = "outline",
  className = "",
  label = "Read on Royal Road",
}: {
  slug: string;
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  const href = getRoyalRoadLink(slug);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, variantClasses[variant], className)}
    >
      <Crown className="w-4 h-4 shrink-0" />
      {label}
    </a>
  );
}
