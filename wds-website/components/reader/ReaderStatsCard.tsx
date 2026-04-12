"use client";

import { Flame, BookOpen, Trophy } from "lucide-react";
import { useReaderStats } from "@/hooks/useReaderStorage";

export function ReaderStatsCard() {
  const stats = useReaderStats();
  if (stats.totalChaptersRead === 0 && stats.streak.current === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 p-4">
      <Stat
        icon={<Flame className="w-4 h-4 text-orange-400" />}
        label="Day streak"
        value={stats.streak.current}
      />
      <Stat
        icon={<BookOpen className="w-4 h-4 text-amber-300" />}
        label="Chapters read"
        value={stats.totalChaptersRead}
      />
      <Stat
        icon={<Trophy className="w-4 h-4 text-yellow-300" />}
        label="Longest streak"
        value={stats.streak.longest}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/50">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
    </div>
  );
}
