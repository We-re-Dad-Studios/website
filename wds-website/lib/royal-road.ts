// Royal Road is now the primary home for new chapters.
// Canonical fiction links, keyed by the novel slug used across the site.

export const ROYAL_ROAD_LINKS: Record<string, string> = {
  dawnshipper: "https://www.royalroad.com/fiction/176874/dawnshipper",
  project_osiris: "https://www.royalroad.com/fiction/176875/project-osiris",
};

export function getRoyalRoadLink(slug: string): string | undefined {
  return ROYAL_ROAD_LINKS[slug];
}

// The site keeps the first half of each novel (rounded up) fully readable;
// the rest is read on Royal Road. Returns the highest chapterNumber that is
// readable on-site — Infinity when the novel isn't on Royal Road.
export function getOnSiteChapterLimit(slug: string, chapterNumbers: number[]): number {
  if (!getRoyalRoadLink(slug)) return Infinity;
  const sorted = chapterNumbers.filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (sorted.length === 0) return Infinity;
  return sorted[Math.ceil(sorted.length / 2) - 1];
}

// How many top-level blocks of a Royal Road chapter we show as a teaser.
export const ROYAL_ROAD_TEASER_BLOCKS = 4;
