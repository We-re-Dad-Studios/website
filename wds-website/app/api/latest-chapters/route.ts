import { NextResponse } from "next/server";
import { createContentfulClient, getNovelChapterNumbers } from "@/lib/contentful";
import { getOnSiteChapterLimit } from "@/lib/royal-road";

// Newest chapters across all novels for the home page "Latest Releases" strip.
export const revalidate = 3600;

export type LatestChapter = {
  title: string;
  novelSlug: string;
  novelName: string;
  chapterNumber: number | null;
  slug: string;
  releaseDate: string | null;
  isFree: boolean;
  /** In the second half of the novel: on-site page is a teaser for Royal Road */
  onRoyalRoad: boolean;
  preview: string | null;
};

const NOVEL_NAMES: Record<string, string> = {
  dawnshipper: "Dawnshipper",
  project_osiris: "Project Osiris",
};

export async function GET() {
  const client = createContentfulClient();
  const chapters: LatestChapter[] = [];

  try {
    const res = await client.getEntries({
      content_type: "chapter",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: "-fields.releaseDate" as any,
      limit: 6,
      include: 0,
    });
    const limits = new Map<string, number>();
    for (const item of res.items) {
      const f = item.fields as Record<string, unknown>;
      const slug = f.slug as string | undefined;
      const projectSlug = f.projectSlug as string | undefined;
      if (!slug || !projectSlug) continue;
      if (!limits.has(projectSlug)) {
        limits.set(
          projectSlug,
          getOnSiteChapterLimit(projectSlug, await getNovelChapterNumbers(projectSlug))
        );
      }
      const chapterNumber = (f.chapterNumber as number) ?? null;
      chapters.push({
        onRoyalRoad: chapterNumber != null && chapterNumber > (limits.get(projectSlug) as number),
        title: (f.title as string) ?? "Untitled",
        novelSlug: projectSlug,
        novelName: NOVEL_NAMES[projectSlug] ?? projectSlug,
        chapterNumber,
        slug,
        releaseDate: (f.releaseDate as string) ?? item.sys.createdAt ?? null,
        isFree: f.isFree !== false,
        preview: (f.previewText as string) ?? null,
      });
    }
  } catch (err) {
    console.error("latest-chapters failed", err);
  }

  return NextResponse.json(
    { chapters },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
