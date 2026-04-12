"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useLatestNovelProgress } from "@/hooks/useReaderStorage";

export function ContinueReadingCard({ novelSlug }: { novelSlug: string }) {
  const progress = useLatestNovelProgress(novelSlug);
  if (!progress) return null;

  const percent = Math.round(progress.percent * 100);

  return (
    <Link
      href={`/novels/${novelSlug}/chapters/${progress.chapterSlug}`}
      className="block group relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 hover:border-amber-400 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 grid place-items-center">
          <BookOpen className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80 mb-1">
            Continue reading
          </p>
          <p className="text-lg font-semibold text-white truncate">
            Chapter {progress.chapterNumber}: {progress.title}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-amber-200/80 tabular-nums">
              {percent}%
            </span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-amber-300 flex-shrink-0 mt-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
