"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Lock } from "lucide-react";
import type { LatestChapter } from "@/app/api/latest-chapters/route";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function LatestReleases() {
  const [chapters, setChapters] = useState<LatestChapter[] | null>(null);

  useEffect(() => {
    fetch("/api/latest-chapters")
      .then((r) => r.json())
      .then((d) => setChapters(d.chapters ?? []))
      .catch(() => setChapters([]));
  }, []);

  // Render nothing until we have content — no empty/skeleton flash.
  if (!chapters || chapters.length === 0) return null;

  return (
    <section className="w-full bg-background px-4 sm:px-6 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-0">
              <Clock className="h-4 w-4" /> Latest Releases
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Hot off the press
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-wds-text-secondary transition-colors hover:text-primary-0 sm:flex"
          >
            All chapters <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch, i) => (
            <motion.div
              key={`${ch.novelSlug}-${ch.slug}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/novels/${ch.novelSlug}/chapters/${ch.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-wds-surface p-4 transition-all hover:border-primary-0/50 hover:shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold uppercase tracking-wider text-primary-0">
                    {ch.novelName}
                  </span>
                  <span className="shrink-0 text-xs text-wds-text-secondary">
                    {timeAgo(ch.releaseDate)}
                  </span>
                </div>
                <div className="mb-1 font-bold text-foreground">
                  {ch.chapterNumber != null && (
                    <span className="text-wds-text-secondary">
                      Ch. {ch.chapterNumber} ·{" "}
                    </span>
                  )}
                  {ch.title}
                </div>
                {ch.preview && (
                  <p className="mb-3 line-clamp-2 text-sm text-wds-text-secondary">
                    {ch.preview}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-foreground">
                  {ch.isFree ? (
                    <span className="inline-flex items-center gap-1 text-primary-0 group-hover:gap-2 transition-all">
                      Read now <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Lock className="h-3 w-3" /> Early Access
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
