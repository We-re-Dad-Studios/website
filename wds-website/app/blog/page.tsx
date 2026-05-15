// app/blog/page.tsx
import { Home } from "./[id]/_components/Home";
import {
  CFBlogPost,
  CFTag,
  createContentfulClient,
  getBlogContentTypeId,
  getPostTagContentTypeId,
} from "@/lib/contentful";

export const revalidate = 60;
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
  try {
    const client = createContentfulClient();
    const [postsResponse, tagsResponse] = await Promise.all([
      client.getEntries({
        content_type: getBlogContentTypeId(),
        limit: 1000,
      }),
      client.getEntries({
        content_type: getPostTagContentTypeId(),
        limit: 1000,
      }),
    ]);

    const posts = postsResponse.items as unknown as CFBlogPost[];
    const tags = tagsResponse.items as unknown as CFTag[];

    return <Home initialPosts={posts} initialTags={tags} />;
  } catch (error) {
    console.error("Failed to load blog index", error);
    return <Home initialPosts={[]} initialTags={[]} />;
  }
}
