"use client";

import { Flame, BookOpen, Trophy } from "lucide-react";
import { useReaderStats } from "@/hooks/useReaderStorage";

// Brand stats strip (library + novel sidebars). Theme tokens only, so it
// reads in both light and dark mode.
export function ReaderStatsCard() {
  const stats = useReaderStats();
  if (stats.totalChaptersRead === 0 && stats.streak.current === 0) return null;

  return (
    <div className="grid grid-cols-3 border border-border border-t-4 border-t-primary-0 bg-card">
      <Stat icon={<Flame className="h-4 w-4" />} label="Day streak" value={stats.streak.current} />
      <Stat icon={<BookOpen className="h-4 w-4" />} label="Chapters read" value={stats.totalChaptersRead} divider />
      <Stat icon={<Trophy className="h-4 w-4" />} label="Longest streak" value={stats.streak.longest} divider />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  divider = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  divider?: boolean;
}) {
  return (
    <div className={`flex flex-col items-start gap-1.5 px-4 py-4 sm:px-5 ${divider ? "border-l border-border" : ""}`}>
      <span className="font-plaguard text-[32px] leading-none text-primary-0 tabular-nums sm:text-[38px]">{value}</span>
      <span className="flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-[0.1em] text-wds-text-secondary sm:text-[15px]">
        <span className="text-primary-0" aria-hidden="true">{icon}</span>
        {label}
      </span>
    </div>
  );
}
