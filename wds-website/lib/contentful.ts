// lib/contentful/server.ts
import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,          // NOT PUBLIC
  accessToken: process.env.CONTENTFUL_CDAPI!,       // NOT PUBLIC
});

export async function getNovelBySlug(slug: string) {
  const response = await client.getEntries({
    content_type: "novel",
    "fields.slug": slug,
    limit: 1,
    include: 0,
  });

  return response.items[0] ?? null;
}

export async function getChapterList(novelId: string) {
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

export async function getChapterContent(chapterId: string) {
  const entry = await client.getEntry(chapterId);
  return entry.fields.content;
}

export async function getChapterBySlug(slug: string) {
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
    content: any; // rich text JSON
    tags?: CFTag[];
    cover?: CFAsset;
  };
}
export interface BlogPageProps {
  initialPosts: CFBlogPost[];
  initialTags: CFTag[];
}
