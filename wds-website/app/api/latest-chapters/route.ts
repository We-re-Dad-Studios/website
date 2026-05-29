import { NextResponse } from "next/server";
import { createContentfulClient } from "@/lib/contentful";

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
    for (const item of res.items) {
      const f = item.fields as Record<string, unknown>;
      const slug = f.slug as string | undefined;
      const projectSlug = f.projectSlug as string | undefined;
      if (!slug || !projectSlug) continue;
      chapters.push({
        title: (f.title as string) ?? "Untitled",
        novelSlug: projectSlug,
        novelName: NOVEL_NAMES[projectSlug] ?? projectSlug,
        chapterNumber: (f.chapterNumber as number) ?? null,
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
