"use client";

import Link from "next/link";
import {
  BookOpen,
  Bookmark as BookmarkIcon,
  CheckCircle2,
  Download,
  ArrowRight,
  Library as LibraryIcon,
} from "lucide-react";
import { useReaderStore } from "@/hooks/useReaderStorage";
import { ReaderStatsCard } from "@/components/reader/ReaderStatsCard";
import { PushOptIn } from "@/components/PushOptIn";
import type { ChapterProgress } from "@/lib/reader-storage";

const NOVEL_NAMES: Record<string, string> = {
  dawnshipper: "Dawnshipper",
  project_osiris: "Project Osiris",
};

const chapterHref = (p: ChapterProgress) =>
  `/novels/${p.novelSlug}/chapters/${p.chapterSlug}`;
const novelName = (slug: string) => NOVEL_NAMES[slug] ?? slug;

export function LibraryClient() {
  const { store, hydrated } = useReaderStore();

  if (!hydrated || !store) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-[19px] text-wds-text-secondary">
        Loading your library…
      </div>
    );
  }

  const allProgress = Object.values(store.progress);
  const inProgress = allProgress
    .filter((p) => !p.finished && p.percent > 0.02)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const finished = allProgress
    .filter((p) => p.finished)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  // Bookmarks/highlights joined back to their chapter via the shared chapterId.
  const bookmarkEntries = Object.entries(store.bookmarks)
    .map(([chapterId, marks]) => ({
      chapterId,
      progress: store.progress[chapterId] ?? null,
      marks: [...marks].sort((a, b) => b.createdAt - a.createdAt),
    }))
    .filter((e) => e.marks.length > 0)
    .sort(
      (a, b) => (b.progress?.updatedAt ?? 0) - (a.progress?.updatedAt ?? 0)
    );

  const offline = store.offline.cachedChapterIds
    .map((id) => store.progress[id])
    .filter((p): p is ChapterProgress => Boolean(p));

  const isEmpty =
    inProgress.length === 0 &&
    finished.length === 0 &&
    bookmarkEntries.length === 0 &&
    store.stats.totalChaptersRead === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <LibraryIcon className="mx-auto mb-6 h-14 w-14 text-primary-0" />
        <h2 className="mb-3 font-plaguard text-[34px] font-normal leading-none text-primary-0">
          Your library is empty
        </h2>
        <p className="mb-8 text-[19px] text-wds-text-secondary">
          Start a chapter and your progress, bookmarks, and reading streak will
          show up here — saved right on this device.
        </p>
        <Link
          href="/projects"
          className="cut-corners-sm inline-flex min-h-[52px] items-center gap-2 bg-brand-indigo px-6 text-[19px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-brand-indigo-deep"
        >
          Browse Stories <ArrowRight className="h-4 w-4" />
        </Link>
        <div className="mx-auto mt-10 max-w-md text-left">
          <PushOptIn />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* New-chapter push alerts (hidden where unsupported) */}
      <PushOptIn />

      {/* Stats */}
      <ReaderStatsCard />

      {/* Currently reading */}
      {inProgress.length > 0 && (
        <Section icon={<BookOpen className="h-5 w-5" />} title="Currently Reading">
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgress.map((p) => (
              <Link
                key={chapterHref(p)}
                href={chapterHref(p)}
                className="group border border-border border-l-4 border-l-primary-0 bg-card p-5 transition-colors hover:bg-foreground/5"
              >
                <div className="text-[15px] font-bold uppercase tracking-[0.1em] text-primary-0">
                  {novelName(p.novelSlug)} · Ch. {p.chapterNumber}
                </div>
                <div className="mt-1 truncate text-[22px] font-bold leading-tight text-foreground">{p.title}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden bg-foreground/10">
                    <div
                      className="h-full bg-primary-0"
                      style={{ width: `${Math.round(p.percent * 100)}%` }}
                    />
                  </div>
                  <span className="text-[16px] font-bold tabular-nums text-foreground">
                    {Math.round(p.percent * 100)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Bookmarks & highlights */}
      {bookmarkEntries.length > 0 && (
        <Section
          icon={<BookmarkIcon className="h-5 w-5" />}
          title="Bookmarks & Highlights"
        >
          <div className="space-y-4">
            {bookmarkEntries.map((entry) => (
              <div
                key={entry.chapterId}
                className="border border-border bg-card p-5"
              >
                {entry.progress ? (
                  <Link
                    href={chapterHref(entry.progress)}
                    className="mb-3 inline-flex items-center gap-1.5 text-[18px] font-bold text-foreground hover:text-primary-0"
                  >
                    {novelName(entry.progress.novelSlug)} · Ch.{" "}
                    {entry.progress.chapterNumber} — {entry.progress.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <div className="mb-3 text-[18px] font-bold text-wds-text-secondary">
                    Saved passages
                  </div>
                )}
                <ul className="m-0 list-none space-y-3 p-0">
                  {entry.marks.map((m) => (
                    <li
                      key={m.id}
                      className="border-l-4 border-brand-pink pl-4 text-[19px] leading-snug text-foreground"
                    >
                      <span className="italic">“{m.text}”</span>
                      {m.note && (
                        <span className="mt-1 block text-[16px] text-wds-text-secondary">
                          — {m.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Saved offline */}
      {offline.length > 0 && (
        <Section icon={<Download className="h-5 w-5" />} title="Saved for Offline">
          <div className="flex flex-wrap gap-2">
            {offline.map((p) => (
              <Link
                key={chapterHref(p)}
                href={chapterHref(p)}
                className="inline-flex min-h-[44px] items-center border-2 border-primary-0 bg-card px-4 text-[17px] font-bold text-foreground transition-colors hover:bg-foreground/5"
              >
                {novelName(p.novelSlug)} · Ch. {p.chapterNumber}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Finished */}
      {finished.length > 0 && (
        <Section icon={<CheckCircle2 className="h-5 w-5" />} title="Finished">
          <div className="flex flex-wrap gap-2">
            {finished.map((p) => (
              <Link
                key={chapterHref(p)}
                href={chapterHref(p)}
                className="inline-flex min-h-[44px] items-center border border-border bg-card px-4 text-[17px] text-foreground transition-colors hover:border-primary-0 hover:bg-foreground/5"
              >
                {novelName(p.novelSlug)} · Ch. {p.chapterNumber}
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-5 flex items-center gap-3 border-b border-t-2 border-primary-0 pb-3 pt-3 font-plaguard text-[26px] font-normal leading-none text-primary-0 sm:text-[30px]">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
