import { NextResponse } from "next/server";
import {
  createContentfulClient,
  getBlogContentTypeId,
} from "@/lib/contentful";

// Rebuilt at most hourly; the client fetches this once per palette session.
export const revalidate = 3600;

export type SearchItem = {
  type: "chapter" | "blog" | "page";
  title: string;
  subtitle: string;
  url: string;
};

const NOVEL_NAMES: Record<string, string> = {
  dawnshipper: "Dawnshipper",
  project_osiris: "Project Osiris",
};

const STATIC_PAGES: SearchItem[] = [
  { type: "page", title: "Home", subtitle: "Page", url: "/" },
  { type: "page", title: "Projects", subtitle: "Page", url: "/projects" },
  { type: "page", title: "Dawnshipper", subtitle: "Novel", url: "/projects/dawnshipper" },
  { type: "page", title: "Project Osiris", subtitle: "Novel", url: "/projects/project_osiris" },
  { type: "page", title: "Blog", subtitle: "Page", url: "/blog" },
  { type: "page", title: "About Us", subtitle: "Page", url: "/about-us" },
  { type: "page", title: "My Library", subtitle: "Page", url: "/library" },
];

export async function GET() {
  const client = createContentfulClient();
  const items: SearchItem[] = [...STATIC_PAGES];

  try {
    const chapters = await client.getEntries({
      content_type: "chapter",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: "fields.chapterNumber" as any,
      limit: 1000,
      include: 0,
    });
    for (const item of chapters.items) {
      const f = item.fields as Record<string, unknown>;
      const slug = f.slug as string | undefined;
      const projectSlug = f.projectSlug as string | undefined;
      if (!slug || !projectSlug) continue;
      const novel = NOVEL_NAMES[projectSlug] ?? projectSlug;
      const num = f.chapterNumber as number | undefined;
      items.push({
        type: "chapter",
        title: (f.title as string) ?? `Chapter ${num ?? ""}`,
        subtitle: `${novel} · Ch. ${num ?? "?"}`,
        url: `/novels/${projectSlug}/chapters/${slug}`,
      });
    }
  } catch (err) {
    console.error("search: chapters failed", err);
  }

  try {
    const posts = await client.getEntries({
      content_type: getBlogContentTypeId(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: "-sys.createdAt" as any,
      limit: 200,
      include: 0,
    });
    for (const item of posts.items) {
      const f = item.fields as Record<string, unknown>;
      items.push({
        type: "blog",
        title: (f.title as string) ?? "Blog post",
        subtitle: "Blog",
        url: `/blog/${item.sys.id}`,
      });
    }
  } catch (err) {
    console.error("search: blog failed", err);
  }

  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
