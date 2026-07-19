// lib/contentful/server.ts
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "contentful";

// Cache tags used for on-demand revalidation from the Contentful webhook.
// `chapters` / `novels` / `blog` bust every page of that type;
// `chapter:<slug>` busts a single chapter page.
export const CACHE_TAGS = {
  chapters: "chapters",
  novels: "novels",
  blog: "blog",
  wiki: "wiki",
  chapter: (slug: string) => `chapter:${slug}`,
} as const;

// How long (seconds) a cached Contentful read survives without a webhook.
// The webhook makes updates near-instant; this is just a safety net.
const CONTENTFUL_REVALIDATE = 3600;

const getEnvValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  throw new Error(`Missing required environment variable. Checked: ${keys.join(", ")}`);
};

export const createContentfulClient = () =>
  createClient({
    space: getEnvValue("CONTENTFUL_SPACE_ID", "NEXT_PUBLIC_CONTENTFUL_SPACE_ID"),
    accessToken: getEnvValue("CONTENTFUL_CDAPI", "NEXT_PUBLIC_CONTENTFUL_CDAPI"),
  });

export const getBlogContentTypeId = () =>
  getEnvValue("BLOGS_ID", "NEXT_PUBLIC_BLOGS_ID");

export const getPostTagContentTypeId = () =>
  getEnvValue("POST_TAGS_ID", "NEXT_PUBLIC_POST_TAG_ID");

export const getProjectContentTypeId = () =>
  getEnvValue("PROJECTS_ID", "NEXT_PUBLIC_PROJECTS_ID");

export const getTagContentTypeId = () =>
  getEnvValue("TAGS_ID", "NEXT_PUBLIC_TAGS_ID");

export interface ChapterRecord {
  id: string;
  slug: string;
  title: string;
  chapterNumber: number;
  releaseDate: string;
  isFree?: boolean;
  previewText?: string;
  projectSlug?: string;
  content?: unknown;
  audioUrl?: string;
  [key: string]: unknown;
}

export const getNovelBySlug = cache(async (slug: string) => {
  const client = createContentfulClient();
  const response = await client.getEntries({
    content_type: "novel",
    "fields.slug": slug,
    limit: 1,
    include: 0,
  });

  return response.items[0] ?? null;
});

export const getChapterList = cache(async (novelId: string) => {
  const client = createContentfulClient();
  const response = await client.getEntries({
    content_type: "chapter",
    "fields.project.sys.id": novelId,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order: "fields.chapterNumber" as any,
    limit: 1000,
    include: 0,
  });

  return response.items.map((item) => ({
    id: item.sys.id,
    ...item.fields,
  }));
});

export const getBlogPost = cache(async (id: string) => {
  const client = createContentfulClient();
  return client.getEntry(id);
});

export async function getChapterContent(chapterId: string) {
  const client = createContentfulClient();
  const entry = await client.getEntry(chapterId);
  return entry.fields.content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAudioUrl(fields: any): string | undefined {
  const file = fields?.audio?.fields?.file;
  if (!file?.url) return undefined;
  // Contentful URLs are protocol-relative, prefix https:
  return file.url.startsWith("//") ? `https:${file.url}` : file.url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAssetUrl(asset: any): string | undefined {
  const url = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

// ---------- Wiki / lore ----------
// Manually curated codex of characters, places, factions and terms.
// Contentful content type `wikiEntry` with fields:
//   name (Symbol), slug (Symbol), type (Symbol: character|place|faction|term|other),
//   aliases (Symbol list), spoilerFreeSummary (Text), body (RichText),
//   firstAppearanceChapter (Symbol), novel (Symbol slug), image (Asset),
//   hasSpoilers (Boolean)
export interface WikiEntryRecord {
  id: string;
  slug: string;
  name: string;
  type: string;
  aliases?: string[];
  spoilerFreeSummary?: string;
  body?: unknown;
  firstAppearanceChapter?: string;
  novel?: string;
  imageUrl?: string;
  hasSpoilers?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWikiEntry(item: any): WikiEntryRecord {
  return {
    id: item.sys.id,
    slug: item.fields.slug as string,
    name: item.fields.name as string,
    type: (item.fields.type as string) ?? "other",
    aliases: item.fields.aliases as string[] | undefined,
    spoilerFreeSummary: item.fields.spoilerFreeSummary as string | undefined,
    body: item.fields.body,
    firstAppearanceChapter: item.fields.firstAppearanceChapter as string | undefined,
    novel: item.fields.novel as string | undefined,
    imageUrl: extractAssetUrl(item.fields.image),
    hasSpoilers: item.fields.hasSpoilers as boolean | undefined,
  };
}

export const getWikiEntries = cache(
  (): Promise<WikiEntryRecord[]> =>
    unstable_cache(
      async () => {
        try {
          const client = createContentfulClient();
          const response = await client.getEntries({
            content_type: "wikiEntry",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            order: "fields.name" as any,
            limit: 1000,
            include: 1,
          });
          return response.items.map(mapWikiEntry);
        } catch {
          // Content type not yet created in Contentful — show an empty codex
          // rather than crashing the page.
          return [];
        }
      },
      ["wiki-entries"],
      { tags: [CACHE_TAGS.wiki], revalidate: CONTENTFUL_REVALIDATE }
    )()
);

export const getWikiEntryBySlug = cache(
  (slug: string): Promise<WikiEntryRecord | null> =>
    unstable_cache(
      async () => {
        try {
          const client = createContentfulClient();
          const response = await client.getEntries({
            content_type: "wikiEntry",
            "fields.slug": slug,
            limit: 1,
            include: 1,
          });
          const item = response.items[0];
          return item ? mapWikiEntry(item) : null;
        } catch {
          return null;
        }
      },
      ["wiki-entry", slug],
      { tags: [CACHE_TAGS.wiki, `wiki:${slug}`], revalidate: CONTENTFUL_REVALIDATE }
    )()
);

export const getChapterBySlug = cache(
  (slug: string): Promise<ChapterRecord | null> =>
    unstable_cache(
      async (): Promise<ChapterRecord | null> => {
        const client = createContentfulClient();
        const response = await client.getEntries({
          content_type: "chapter",
          "fields.slug": slug,
          limit: 1,
        });

        const item = response.items[0];
        if (!item) {
          return null;
        }

        return {
          id: item.sys.id,
          ...(item.fields as Record<string, unknown>),
          slug: item.fields.slug as string,
          title: item.fields.title as string,
          chapterNumber: item.fields.chapterNumber as number,
          releaseDate: item.fields.releaseDate as string,
          isFree: item.fields.isFree as boolean | undefined,
          previewText: item.fields.previewText as string | undefined,
          projectSlug: item.fields.projectSlug as string | undefined,
          content: item.fields.content,
          audioUrl: extractAudioUrl(item.fields),
        };
      },
      ["chapter-by-slug", slug],
      {
        tags: [CACHE_TAGS.chapters, CACHE_TAGS.chapter(slug)],
        revalidate: CONTENTFUL_REVALIDATE,
      }
    )()
);

// All { slug, chapterSlug } pairs for generateStaticParams.
// `slug` is the novel slug (stored as `projectSlug` on the chapter).
export const getAllChapterParams = cache(
  (): Promise<{ slug: string; chapterSlug: string }[]> =>
    unstable_cache(
      async () => {
        const client = createContentfulClient();
        const response = await client.getEntries({
          content_type: "chapter",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          select: ["fields.slug", "fields.projectSlug"] as any,
          limit: 1000,
        });

        return response.items
          .map((item) => ({
            slug: item.fields.projectSlug as string,
            chapterSlug: item.fields.slug as string,
          }))
          .filter((p) => p.slug && p.chapterSlug);
      },
      ["all-chapter-params"],
      { tags: [CACHE_TAGS.chapters], revalidate: CONTENTFUL_REVALIDATE }
    )()
);

export function getChapterByNumber(
  chapterNumber: number,
  projectSlug: string
): Promise<ChapterRecord | null> {
  return unstable_cache(
    async (): Promise<ChapterRecord | null> => {
      const client = createContentfulClient();
      const response = await client.getEntries({
        content_type: "chapter",
        "fields.chapterNumber": chapterNumber,
        "fields.projectSlug": projectSlug,
        limit: 1,
      });

      const item = response.items[0];
      if (!item) {
        return null;
      }

      return {
        id: item.sys.id,
        ...(item.fields as Record<string, unknown>),
        slug: item.fields.slug as string,
        title: item.fields.title as string,
        chapterNumber: item.fields.chapterNumber as number,
        releaseDate: item.fields.releaseDate as string,
        isFree: item.fields.isFree as boolean | undefined,
        previewText: item.fields.previewText as string | undefined,
        projectSlug: item.fields.projectSlug as string | undefined,
        content: item.fields.content,
        audioUrl: extractAudioUrl(item.fields),
      };
    },
    ["chapter-by-number", projectSlug, String(chapterNumber)],
    { tags: [CACHE_TAGS.chapters], revalidate: CONTENTFUL_REVALIDATE }
  )();
}
// Generic Contentful system fields
export interface Sys {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
}

// Contentful asset type
export interface CFAsset {
  sys: Sys;
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details?: any;
      fileName?: string;
      contentType?: string;
    };
  };
}

// Contentful tag (blog tag)
export interface CFTag {
  sys: Sys;
  fields: {
    name: string;
  };
}

// Blog Post structure from Contentful
export interface CFBlogPost {
  sys: Sys;
  fields: {
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any; // rich text JSON
    tags?: CFTag[];
    cover?: CFAsset;
  };
}
export interface BlogPageProps {
  initialPosts: CFBlogPost[];
  initialTags: CFTag[];
}
