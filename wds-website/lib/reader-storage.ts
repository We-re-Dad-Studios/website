// lib/reader-storage.ts
// Single source of truth for client-side reader persistence.
// All writes go through this module so we have one schema, one versioning story,
// and one place to wire cross-tab sync.

const ROOT_KEY = "wds:reader:v1";

export type HighlightColor = "amber" | "green" | "blue" | "pink";

export interface ChapterProgress {
  percent: number;
  updatedAt: number;
  novelSlug: string;
  chapterSlug: string;
  chapterNumber: number;
  title: string;
  finished: boolean;
}

export interface Bookmark {
  id: string;
  type: "bookmark" | "highlight";
  paragraphIndex: number;
  text: string;
  note?: string;
  color: HighlightColor;
  startOffset?: number;
  endOffset?: number;
  createdAt: number;
}

export interface ReaderStats {
  totalChaptersRead: number;
  chaptersReadIds: string[];
  streak: {
    current: number;
    longest: number;
    lastReadDate: string | null; // YYYY-MM-DD local
  };
}

export interface ReaderStore {
  progress: Record<string, ChapterProgress>;
  bookmarks: Record<string, Bookmark[]>;
  stats: ReaderStats;
  offline: { cachedChapterIds: string[] };
}

const EMPTY_STORE: ReaderStore = {
  progress: {},
  bookmarks: {},
  stats: {
    totalChaptersRead: 0,
    chaptersReadIds: [],
    streak: { current: 0, longest: 0, lastReadDate: null },
  },
  offline: { cachedChapterIds: [] },
};

const isClient = () => typeof window !== "undefined";

function read(): ReaderStore {
  if (!isClient()) return EMPTY_STORE;
  try {
    const raw = window.localStorage.getItem(ROOT_KEY);
    if (!raw) return structuredClone(EMPTY_STORE);
    const parsed = JSON.parse(raw) as Partial<ReaderStore>;
    return {
      progress: parsed.progress ?? {},
      bookmarks: parsed.bookmarks ?? {},
      stats: {
        totalChaptersRead: parsed.stats?.totalChaptersRead ?? 0,
        chaptersReadIds: parsed.stats?.chaptersReadIds ?? [],
        streak: {
          current: parsed.stats?.streak?.current ?? 0,
          longest: parsed.stats?.streak?.longest ?? 0,
          lastReadDate: parsed.stats?.streak?.lastReadDate ?? null,
        },
      },
      offline: { cachedChapterIds: parsed.offline?.cachedChapterIds ?? [] },
    };
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

function write(store: ReaderStore) {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(ROOT_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("wds:reader:change"));
  } catch {
    // Quota exceeded or private browsing — silently degrade.
  }
}

export const readerStorage = {
  get: read,

  // ---------- Progress ----------
  saveProgress(
    chapterId: string,
    data: Omit<ChapterProgress, "updatedAt" | "finished"> & { finished?: boolean }
  ): { justFinished: boolean } {
    const store = read();
    const prev = store.progress[chapterId];
    const wasFinished = prev?.finished ?? false;
    const nowFinished = data.finished ?? data.percent >= 0.95;

    store.progress[chapterId] = {
      ...data,
      updatedAt: Date.now(),
      finished: nowFinished || wasFinished,
    };
    write(store);
    return { justFinished: !wasFinished && nowFinished };
  },

  getProgress(chapterId: string): ChapterProgress | null {
    return read().progress[chapterId] ?? null;
  },

  getLatestProgressForNovel(novelSlug: string): ChapterProgress | null {
    const store = read();
    const entries = Object.values(store.progress)
      .filter((p) => p.novelSlug === novelSlug && !p.finished && p.percent > 0.02)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return entries[0] ?? null;
  },

  // Most recently-read, still-unfinished chapter across every novel.
  // Powers the homepage "Continue Reading" card.
  getMostRecentProgress(): ChapterProgress | null {
    const store = read();
    const entries = Object.values(store.progress)
      .filter((p) => !p.finished && p.percent > 0.02)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return entries[0] ?? null;
  },

  // ---------- Stats / streaks ----------
  recordChapterRead(chapterId: string): ReaderStats {
    const store = read();
    const stats = store.stats;

    if (!stats.chaptersReadIds.includes(chapterId)) {
      stats.chaptersReadIds.push(chapterId);
      stats.totalChaptersRead = stats.chaptersReadIds.length;
    }

    const today = localDateKey(new Date());
    const last = stats.streak.lastReadDate;

    if (last === today) {
      // Already counted today.
    } else if (last && daysBetween(last, today) === 1) {
      stats.streak.current += 1;
    } else {
      stats.streak.current = 1;
    }
    stats.streak.longest = Math.max(stats.streak.longest, stats.streak.current);
    stats.streak.lastReadDate = today;

    write(store);
    return stats;
  },

  getStats(): ReaderStats {
    return read().stats;
  },

  // ---------- Bookmarks ----------
  addBookmark(chapterId: string, bookmark: Bookmark) {
    const store = read();
    const list = store.bookmarks[chapterId] ?? [];
    list.push(bookmark);
    store.bookmarks[chapterId] = list;
    write(store);
  },

  removeBookmark(chapterId: string, bookmarkId: string) {
    const store = read();
    const list = store.bookmarks[chapterId] ?? [];
    store.bookmarks[chapterId] = list.filter((b) => b.id !== bookmarkId);
    write(store);
  },

  getBookmarks(chapterId: string): Bookmark[] {
    return read().bookmarks[chapterId] ?? [];
  },

  getAllBookmarks(): Record<string, Bookmark[]> {
    return read().bookmarks;
  },

  // ---------- Offline ----------
  markOffline(chapterId: string) {
    const store = read();
    if (!store.offline.cachedChapterIds.includes(chapterId)) {
      store.offline.cachedChapterIds.push(chapterId);
      write(store);
    }
  },

  unmarkOffline(chapterId: string) {
    const store = read();
    store.offline.cachedChapterIds = store.offline.cachedChapterIds.filter(
      (id) => id !== chapterId
    );
    write(store);
  },

  isOffline(chapterId: string): boolean {
    return read().offline.cachedChapterIds.includes(chapterId);
  },
};

// ---------- Helpers ----------
function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}
