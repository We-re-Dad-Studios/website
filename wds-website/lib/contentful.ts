// lib/contentful/server.ts
import { cache } from "react";
import { createClient } from "contentful";

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

export const getChapterBySlug = cache(async (slug: string): Promise<ChapterRecord | null> => {
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
});

export async function getChapterByNumber(
  chapterNumber: number,
  projectSlug: string
): Promise<ChapterRecord | null> {
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
