"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, Hash, Loader2 } from "lucide-react";
import type { SearchItem } from "@/app/api/search/route";

const TYPE_ICON = {
  chapter: BookOpen,
  blog: FileText,
  page: Hash,
} as const;

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wds:open-search", () => setOpen(true));
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lazy-load the index the first time the palette opens.
  useEffect(() => {
    if (!open || items !== null) return;
    setLoading(true);
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, items]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
    else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  const go = (item: SearchItem) => {
    setOpen(false);
    router.push(item.url);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[12vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-wds-text-secondary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                go(results[active]);
              }
            }}
            placeholder="Search chapters, posts, pages…"
            className="w-full bg-transparent py-4 text-foreground outline-none placeholder:text-wds-text-secondary"
          />
          {loading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-wds-text-secondary" />
          )}
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && !loading && (
            <div className="px-4 py-8 text-center text-sm text-wds-text-secondary">
              {query ? "No matches." : "Start typing to search."}
            </div>
          )}
          {results.map((item, i) => {
            const Icon = TYPE_ICON[item.type];
            return (
              <button
                key={`${item.url}-${i}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-primary-0/10" : ""
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    i === active ? "text-primary-0" : "text-wds-text-secondary"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-wds-text-secondary">
                    {item.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-wds-text-secondary">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span>⌘K</span>
        </div>
      </div>
    </div>
  );
}
