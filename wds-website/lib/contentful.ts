// lib/contentful/server.ts
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

export async function getNovelBySlug(slug: string) {
  const client = createContentfulClient();
  const response = await client.getEntries({
    content_type: "novel",
    "fields.slug": slug,
    limit: 1,
    include: 0,
  });

  return response.items[0] ?? null;
}

export async function getChapterList(novelId: string) {
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
}

export async function getBlogPost(id: string) {
  const client = createContentfulClient();
  return client.getEntry(id);
}

export async function getChapterContent(chapterId: string) {
  const client = createContentfulClient();
  const entry = await client.getEntry(chapterId);
  return entry.fields.content;
}

export async function getChapterBySlug(slug: string) {
  const client = createContentfulClient();
  const response = await client.getEntries({
    content_type: "chapter",
    "fields.slug": slug,
    limit: 1,
  });

  return response.items[0]?.fields ?? null;
}

export async function getChapterByNumber(
  chapterNumber: number,
  projectSlug: string
) {
  const client = createContentfulClient();
  const response = await client.getEntries({
    content_type: "chapter",
    "fields.chapterNumber": chapterNumber,
    "fields.projectSlug": projectSlug,
    limit: 1,
  });

  return response.items[0]?.fields ?? null;
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
