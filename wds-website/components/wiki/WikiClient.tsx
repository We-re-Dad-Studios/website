"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import type { WikiEntryRecord } from "@/lib/contentful";

const TYPE_LABELS: Record<string, string> = {
  character: "Characters",
  place: "Places",
  faction: "Factions",
  term: "Terms",
  other: "Other",
};

const typeLabel = (type: string) => TYPE_LABELS[type] ?? "Other";

export function WikiClient({ entries }: { entries: WikiEntryRecord[] }) {
  const [activeType, setActiveType] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Build the filter chips from the types actually present.
  const types = useMemo(() => {
    const present = new Set(entries.map((e) => e.type));
    return ["all", ...Object.keys(TYPE_LABELS).filter((t) => present.has(t))];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (activeType !== "all" && e.type !== activeType) return false;
      if (!q) return true;
      const haystack = [e.name, e.spoilerFreeSummary, ...(e.aliases ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, activeType, query]);

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center text-wds-text-secondary">
        The codex is being written. Check back soon.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">
      {/* Search + filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wds-text-secondary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the codex…"
            className="w-full rounded-full border border-border bg-wds-surface py-2 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary-0/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                activeType === t
                  ? "bg-primary-0 text-white"
                  : "border border-border bg-wds-surface text-wds-text-secondary hover:text-foreground"
              }`}
            >
              {t === "all" ? "All" : typeLabel(t)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-wds-text-secondary">
          Nothing matches that search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <Link
              key={entry.id}
              href={`/wiki/${entry.slug}`}
              className="group flex gap-4 rounded-xl border border-border bg-wds-surface p-4 transition-all hover:border-primary-0/50"
            >
              {entry.imageUrl ? (
                <Image
                  src={entry.imageUrl}
                  alt={entry.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-0/10 text-xl font-bold text-primary-0">
                  {entry.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-0">
                  {typeLabel(entry.type)}
                </div>
                <div className="truncate font-bold text-foreground">
                  {entry.name}
                </div>
                {entry.spoilerFreeSummary && (
                  <p className="mt-1 line-clamp-2 text-sm text-wds-text-secondary">
                    {entry.spoilerFreeSummary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
