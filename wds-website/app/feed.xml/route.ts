import {
  createContentfulClient,
  getBlogContentTypeId,
} from "@/lib/contentful";

const SITE = "https://weredadstudios.com";

// Regenerate at most once an hour; chapters publish daily, not by the second.
export const revalidate = 3600;

type FeedItem = {
  title: string;
  link: string;
  description: string;
  date: Date;
  guid: string;
};

const NOVEL_NAMES: Record<string, string> = {
  dawnshipper: "Dawnshipper",
  project_osiris: "Project Osiris",
};

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function collectItems(): Promise<FeedItem[]> {
  const client = createContentfulClient();
  const items: FeedItem[] = [];

  // Chapters across all novels, newest first.
  try {
    const chapters = await client.getEntries({
      content_type: "chapter",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: "-fields.releaseDate" as any,
      limit: 40,
      include: 0,
    });

    for (const item of chapters.items) {
      const f = item.fields as Record<string, unknown>;
      const slug = f.slug as string | undefined;
      const projectSlug = f.projectSlug as string | undefined;
      if (!slug || !projectSlug) continue;

      const novel = NOVEL_NAMES[projectSlug] ?? projectSlug;
      const num = f.chapterNumber as number | undefined;
      const title = (f.title as string) ?? `Chapter ${num ?? ""}`;
      const dateRaw =
        (f.releaseDate as string) ?? item.sys.createdAt;

      // `isFree` undefined => treat as free (current state). Once advance
      // chapters land, non-free ones are teased as early-access — the feed
      // advertises premium content rather than hiding or giving it away.
      const isFree = f.isFree !== false;
      const preview =
        (f.previewText as string) ?? `New chapter of ${novel} is live.`;

      items.push({
        title: `${isFree ? "" : "⭐ Early Access — "}${novel} · Ch. ${
          num ?? "?"
        } — ${title}`,
        link: `${SITE}/novels/${projectSlug}/chapters/${slug}`,
        description: isFree
          ? preview
          : `Early-access chapter for supporters. ${preview}`,
        date: new Date(dateRaw),
        guid: item.sys.id,
      });
    }
  } catch (err) {
    console.error("RSS: failed to load chapters", err);
  }

  // Blog posts.
  try {
    const posts = await client.getEntries({
      content_type: getBlogContentTypeId(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: "-sys.createdAt" as any,
      limit: 20,
      include: 0,
    });

    for (const item of posts.items) {
      const f = item.fields as Record<string, unknown>;
      const title = (f.title as string) ?? "Blog post";
      items.push({
        title: `Blog · ${title}`,
        link: `${SITE}/blog/${item.sys.id}`,
        description:
          (f.description as string) ?? "New post from We're Dad Studios.",
        date: new Date(item.sys.createdAt),
        guid: item.sys.id,
      });
    }
  } catch (err) {
    console.error("RSS: failed to load blog posts", err);
  }

  return items
    .filter((i) => !Number.isNaN(i.date.getTime()))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 50);
}

export async function GET() {
  const items = await collectItems();
  const lastBuild = (items[0]?.date ?? new Date()).toUTCString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>We're Dad Studios — New Chapters &amp; Posts</title>
    <link>${SITE}</link>
    <description>Latest chapters and blog posts from We're Dad Studios — dark fantasy and supernatural thriller, updated daily.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="false">${i.guid}</guid>
      <pubDate>${i.date.toUTCString()}</pubDate>
      <description>${escapeXml(i.description)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
