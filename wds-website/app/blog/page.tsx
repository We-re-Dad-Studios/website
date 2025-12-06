// app/blog/page.tsx
import { createClient } from "contentful";
import { Home } from "./[id]/_components/Home";
import { CFAsset, CFBlogPost, CFTag } from "@/lib/contentful";

export const dynamic = "force-dynamic";
export interface BlogPostPageParams {
  params: {
    id: string;
  };
}

export interface BlogPostData {
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any; // rich text JSON
  cover?: CFAsset;
}

export default async function Page() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!,
  });

 const response = await client.getEntries({
  content_type: process.env.BLOGS_ID!,
  limit: 1000,
});

const posts = response.items as unknown as CFBlogPost[];


  const tags = (
    await client.getEntries({
      content_type: process.env.POST_TAGS_ID!,
      limit: 1000,
    })
  ).items as unknown as CFTag[];

  return <Home initialPosts={posts} initialTags={tags} />;
}
