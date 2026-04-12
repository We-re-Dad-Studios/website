"use client";

// hooks/useReaderStorage.ts
// Reactive wrappers around lib/reader-storage.ts. Subscribes to the custom
// "wds:reader:change" event so multiple components stay in sync within a tab,
// and to "storage" for cross-tab sync.

import { useCallback, useEffect, useState } from "react";
import {
  readerStorage,
  type Bookmark,
  type ChapterProgress,
  type ReaderStats,
} from "@/lib/reader-storage";

function useReaderSubscription() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("wds:reader:change", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("wds:reader:change", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return tick;
}

export function useChapterProgress(chapterId: string | null): ChapterProgress | null {
  useReaderSubscription();
  const [value, setValue] = useState<ChapterProgress | null>(null);
  useEffect(() => {
    if (!chapterId) return;
    setValue(readerStorage.getProgress(chapterId));
  }, [chapterId]);
  return value;
}

export function useLatestNovelProgress(novelSlug: string): ChapterProgress | null {
  const tick = useReaderSubscription();
  const [value, setValue] = useState<ChapterProgress | null>(null);
  useEffect(() => {
    setValue(readerStorage.getLatestProgressForNovel(novelSlug));
  }, [novelSlug, tick]);
  return value;
}

export function useReaderStats(): ReaderStats {
  const tick = useReaderSubscription();
  const [value, setValue] = useState<ReaderStats>(() => ({
    totalChaptersRead: 0,
    chaptersReadIds: [],
    streak: { current: 0, longest: 0, lastReadDate: null },
  }));
  useEffect(() => {
    setValue(readerStorage.getStats());
  }, [tick]);
  return value;
}

export function useBookmarks(chapterId: string | null): {
  bookmarks: Bookmark[];
  add: (b: Bookmark) => void;
  remove: (id: string) => void;
} {
  const tick = useReaderSubscription();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!chapterId) return;
    setBookmarks(readerStorage.getBookmarks(chapterId));
  }, [chapterId, tick]);

  const add = useCallback(
    (b: Bookmark) => {
      if (!chapterId) return;
      readerStorage.addBookmark(chapterId, b);
    },
    [chapterId]
  );

  const remove = useCallback(
    (id: string) => {
      if (!chapterId) return;
      readerStorage.removeBookmark(chapterId, id);
    },
    [chapterId]
  );

  return { bookmarks, add, remove };
}

export function useOfflineChapters(): {
  cached: string[];
  mark: (id: string) => void;
  unmark: (id: string) => void;
  isCached: (id: string) => boolean;
} {
  const tick = useReaderSubscription();
  const [cached, setCached] = useState<string[]>([]);

  useEffect(() => {
    setCached(readerStorage.get().offline.cachedChapterIds);
  }, [tick]);

  return {
    cached,
    mark: readerStorage.markOffline,
    unmark: readerStorage.unmarkOffline,
    isCached: readerStorage.isOffline,
  };
}
