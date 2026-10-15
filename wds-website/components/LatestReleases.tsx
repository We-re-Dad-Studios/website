"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Lock } from "lucide-react";
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
    <section className="w-full bg-background px-4 sm:px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-t-2 border-primary-0 pb-5 pt-4">
          <h2 className="m-0 font-plaguard text-[34px] font-normal leading-none text-primary-0 sm:text-[46px] lg:text-[60px]">
            Latest releases
          </h2>
          <Link
            href="/library"
            className="inline-flex shrink-0 items-center gap-2 text-[18px] font-bold uppercase tracking-[0.06em] text-primary-0 transition-colors hover:text-foreground sm:text-[20px]"
          >
            Open the library <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        </div>

        <ul className="m-0 list-none p-0">
          {chapters.map((ch, i) => (
            <motion.li
              key={`${ch.novelSlug}-${ch.slug}`}
              className="border-b border-border"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/novels/${ch.novelSlug}/chapters/${ch.slug}`}
                className="group flex flex-wrap items-center gap-x-5 gap-y-2 px-1 py-4 text-foreground transition-colors hover:bg-foreground/5 sm:py-5"
              >
                <span className="flex min-w-[150px] items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[14px] font-bold uppercase tracking-[0.1em] sm:text-[16px] ${novelTagClass(ch.novelSlug)}`}
                  >
                    {ch.novelName}
                  </span>
                </span>
                {ch.chapterNumber != null && (
                  <span className="min-w-[64px] text-[16px] uppercase tracking-[0.08em] text-wds-text-secondary sm:text-[18px]">
                    Ch. {ch.chapterNumber}
                  </span>
                )}
                <span className="min-w-0 flex-[1_1_260px]">
                  <span className="block text-[21px] font-bold leading-tight sm:text-[25px]">{ch.title}</span>
                  {ch.preview && (
                    <span className="mt-1 line-clamp-1 text-[17px] text-wds-text-secondary">
                      {ch.preview}
                    </span>
                  )}
                </span>
                <span className="text-[16px] text-wds-text-secondary sm:text-[18px]">
                  {timeAgo(ch.releaseDate)}
                </span>
                {ch.onRoyalRoad ? (
                  <span className="inline-flex items-center gap-1.5 bg-brand-indigo px-2.5 py-1 text-[14px] font-bold uppercase tracking-[0.08em] text-white">
                    <Crown className="h-3.5 w-3.5" aria-hidden="true" /> On Royal Road
                  </span>
                ) : ch.isFree ? (
                  <ArrowRight
                    className="h-6 w-6 shrink-0 text-primary-0 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                    aria-label="Read now"
                  />
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-brand-ink px-2.5 py-1 text-[14px] font-bold uppercase tracking-[0.08em] text-brand-green">
                    <Lock className="h-3.5 w-3.5" /> Early access
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Novel identity colours: Dawnshipper = Pink Fantasy, Osiris = Electric Green.
function novelTagClass(novelSlug: string): string {
  if (novelSlug === "dawnshipper") return "bg-brand-pink text-brand-ink";
  if (novelSlug === "project_osiris") return "bg-brand-green text-brand-ink";
  return "bg-brand-indigo text-white";
}
