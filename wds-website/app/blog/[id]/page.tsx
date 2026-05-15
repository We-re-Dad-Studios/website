// app/blog/[id]/page.tsx
import { Asset, Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";
import { FadedContent } from "./_components/Content";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPageParams } from "../page";
import { getBlogPost } from "@/lib/contentful";

export const revalidate = 60;

async function getBlogEntryOrNull(id: string) {
  try {
    return await getBlogPost(id);
  } catch (error) {
    console.error(`Failed to load blog post ${id}`, error);
    return null;
  }
}

export default async function Page({ params }: BlogPostPageParams) {
  const { id } = await params;
  const entry = await getBlogEntryOrNull(id);
  if (!entry) {
    notFound();
  }

  const post = entry.fields;
  const title = typeof post.title === "string" ? post.title : "Blog post";
  const content = post.content;

  const cover = post.cover as Entry<EntrySkeletonType> | Asset | undefined;
  const file = cover?.fields.file as unknown as { url: string };
  const url =
    cover && "fields" in cover && "file" in cover.fields
      ? "https:" + file?.url
      : undefined;

  return (
    <section>
      <div className="flex justify-center items-center h-[400px] bg-neutral-100 dark:bg-black">
        {url ? (
          <Image
            src={url}
            alt={title}
            width={1000}
            height={600}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/images/WDS LOGO WHITE.png"
            alt={title}
            width={200}
            height={200}
            className="opacity-50"
          />
        )}
      </div>

      <FadedContent title={title} content={content as unknown as string} />
    </section>
  );
}

export async function generateMetadata(
  { params }: BlogPostPageParams
): Promise<Metadata> {
  const { id } = await params;
  const entry = await getBlogEntryOrNull(id);
  if (!entry) {
    return {
      title: "Blog post not found",
      description: "The requested blog post could not be loaded.",
    };
  }

  const post = entry.fields;
  const title = typeof post.title === "string" ? post.title : "Blog post";
  const description =
    typeof post.description === "string"
      ? post.description
      : "Read the latest updates from We're Dad Studios.";

  const cover = post.cover as Entry<EntrySkeletonType> | Asset | undefined;
  const file = cover?.fields.file as unknown as { url: string };
  const url =
    cover && "fields" in cover && "file" in cover.fields
      ? "https:" + file?.url
      : "/images/default-cover.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [url],
    },
  };
}
