// app/blog/page.tsx
import { Home } from "./[id]/_components/Home";
import {
  CFBlogPost,
  CFTag,
  createContentfulClient,
  getBlogContentTypeId,
  getPostTagContentTypeId,
} from "@/lib/contentful";

export const dynamic = "force-dynamic";
export interface BlogPostPageParams {
  params: Promise<{
    id: string;
  }>;
}

export interface BlogPostData {
  title: string;
  description?: string;
  content: unknown; // rich text JSON
}

export default async function Page() {
  const client = createContentfulClient();

 const response = await client.getEntries({
  content_type: getBlogContentTypeId(),
  limit: 1000,
});

const posts = response.items as unknown as CFBlogPost[];


  const tags = (
    await client.getEntries({
      content_type: getPostTagContentTypeId(),
      limit: 1000,
    })
  ).items as unknown as CFTag[];

  return <Home initialPosts={posts} initialTags={tags} />;
}
