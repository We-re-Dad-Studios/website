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
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-wds-text-secondary">
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
        <LibraryIcon className="mx-auto mb-6 h-14 w-14 text-primary-0/70" />
        <h2 className="mb-3 text-2xl font-bold text-foreground">
          Your library is empty
        </h2>
        <p className="mb-8 text-wds-text-secondary">
          Start a chapter and your progress, bookmarks, and reading streak will
          show up here — saved right on this device.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full bg-primary-0 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
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
                className="group rounded-xl border border-border bg-wds-surface p-4 transition-all hover:border-primary-0/50"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-0">
                  {novelName(p.novelSlug)} · Ch. {p.chapterNumber}
                </div>
                <div className="truncate font-bold text-foreground">{p.title}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-primary-0"
                      style={{ width: `${Math.round(p.percent * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-wds-text-secondary">
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
                className="rounded-xl border border-border bg-wds-surface p-4"
              >
                {entry.progress ? (
                  <Link
                    href={chapterHref(entry.progress)}
                    className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-foreground hover:text-primary-0"
                  >
                    {novelName(entry.progress.novelSlug)} · Ch.{" "}
                    {entry.progress.chapterNumber} — {entry.progress.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <div className="mb-3 text-sm font-bold text-wds-text-secondary">
                    Saved passages
                  </div>
                )}
                <ul className="space-y-2">
                  {entry.marks.map((m) => (
                    <li
                      key={m.id}
                      className="border-l-2 border-primary-0/50 pl-3 text-sm text-wds-text-secondary"
                    >
                      <span className="italic">“{m.text}”</span>
                      {m.note && (
                        <span className="mt-1 block text-xs text-foreground/70">
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
                className="rounded-full border border-border bg-wds-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary-0/50"
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
                className="rounded-full border border-border bg-wds-surface px-3 py-1.5 text-sm text-wds-text-secondary transition-colors hover:border-primary-0/50 hover:text-foreground"
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
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
        <span className="text-primary-0">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
