"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { useMostRecentProgress } from "@/hooks/useReaderStorage";

const NOVEL_NAMES: Record<string, string> = {
  dawnshipper: "Dawnshipper",
  project_osiris: "Project Osiris",
};

const NOVEL_ACCENTS: Record<string, string> = {
  dawnshipper: "rgba(249,76,16,0.35)", // primary orange
  project_osiris: "rgba(6,182,212,0.35)", // cyan
};

/**
 * "Pick up where you left off" card. Renders nothing on the server and for
 * readers with no in-progress chapter, so it never causes a hydration mismatch
 * and stays invisible to first-time visitors.
 */
export function ContinueReading() {
  const latest = useMostRecentProgress();
  if (!latest) return null;

  const novelName = NOVEL_NAMES[latest.novelSlug] ?? latest.novelSlug;
  const percent = Math.round(latest.percent * 100);
  const accent = NOVEL_ACCENTS[latest.novelSlug] ?? "rgba(255,255,255,0.2)";
  const href = `/novels/${latest.novelSlug}/chapters/${latest.chapterSlug}`;

  return (
    <section className="w-full bg-background px-4 sm:px-6 pt-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href={href}
          className="group relative flex items-center gap-4 sm:gap-5 rounded-2xl border border-border bg-wds-surface p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:border-primary-0/50"
          style={{ boxShadow: `0 0 0 0 ${accent}` }}
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary-0/10 text-primary-0">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-0">
              Continue Reading
            </div>
            <div className="truncate text-sm sm:text-base font-bold text-foreground">
              {novelName} · Ch. {latest.chapterNumber}
            </div>
            <div className="truncate text-xs sm:text-sm text-wds-text-secondary">
              {latest.title}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-primary-0 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-wds-text-secondary">
                {percent}%
              </span>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 shrink-0 text-wds-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-primary-0" />
        </Link>
      </div>
    </section>
  );
}
