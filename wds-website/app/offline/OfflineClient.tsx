"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readerStorage, type ChapterProgress } from "@/lib/reader-storage";
import { BookOpen, ArrowRight } from "lucide-react";

export function OfflineClient() {
  const [cached, setCached] = useState<ChapterProgress[]>([]);

  useEffect(() => {
    const store = readerStorage.get();
    const ids = new Set(store.offline.cachedChapterIds);
    const entries = Object.entries(store.progress)
      .filter(([id]) => ids.has(id))
      .map(([, p]) => p)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    setCached(entries);
  }, []);

  if (cached.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
        <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">
          You haven&apos;t saved any chapters for offline reading yet.
        </p>
        <p className="text-xs mt-2 opacity-70">
          Open a chapter and tap the <strong>Offline</strong> button in the
          reader toolbar to save it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm uppercase tracking-wider text-white/50 mb-2">
        Saved for offline
      </h2>
      {cached.map((p) => (
        <Link
          key={`${p.novelSlug}-${p.chapterSlug}`}
          href={`/novels/${p.novelSlug}/chapters/${p.chapterSlug}`}
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-amber-400 transition-colors"
        >
          <BookOpen className="w-5 h-5 text-amber-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-white/40">
              {p.novelSlug.replace(/_/g, " ")}
            </p>
            <p className="text-sm font-medium truncate">
              Chapter {p.chapterNumber}: {p.title}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
        </Link>
      ))}
    </div>
  );
}
