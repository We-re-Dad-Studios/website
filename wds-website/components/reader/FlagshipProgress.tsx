"use client";

import { useLatestNovelProgress, useReaderStats } from "@/hooks/useReaderStorage";
import { readerStorage } from "@/lib/reader-storage";
import { useEffect, useState } from "react";

const ACCENT_MAP: Record<string, string> = {
  "primary-0": "#4F1787",
  "cyan-500": "#06b6d4",
};

export function FlagshipProgress({
  novelSlug,
  accentColor = "primary-0",
}: {
  novelSlug: string;
  accentColor?: string;
}) {
  const latest = useLatestNovelProgress(novelSlug);
  const stats = useReaderStats();

  // Count finished chapters for this novel
  const [finishedCount, setFinishedCount] = useState(0);
  useEffect(() => {
    const store = readerStorage.get();
    const count = Object.values(store.progress).filter(
      (p) => p.novelSlug === novelSlug && p.finished
    ).length;
    setFinishedCount(count);
  }, [novelSlug, stats.totalChaptersRead]);

  // Nothing to show if reader hasn't touched this novel
  if (!latest && finishedCount === 0) return null;

  const currentPercent = latest ? Math.round(latest.percent * 100) : 0;
  const label = latest
    ? `Ch. ${latest.chapterNumber} · ${currentPercent}%`
    : `${finishedCount} finished`;

  return (
    <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-white/70">Your progress</span>
        <span className="text-white font-medium">{label}</span>
      </div>
      {latest && (
        <div className="mt-1.5 sm:mt-2 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${currentPercent}%`,
              backgroundColor: ACCENT_MAP[accentColor] ?? ACCENT_MAP["primary-0"],
            }}
          />
        </div>
      )}
    </div>
  );
}
