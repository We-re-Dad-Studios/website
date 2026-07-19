// Royal Road is now the primary home for new chapters.
// Canonical fiction links, keyed by the novel slug used across the site.

export const ROYAL_ROAD_LINKS: Record<string, string> = {
  dawnshipper:
    "https://www.royalroad.com/fiction/176874/dawnshipper-epic-progression-fantasy-magic-system",
  project_osiris: "https://www.royalroad.com/fiction/176875/project-osiris",
};

export function getRoyalRoadLink(slug: string): string | undefined {
  return ROYAL_ROAD_LINKS[slug];
}
