// app/blog/[id]/page.tsx
import { Asset, Entry, EntrySkeletonType, createClient } from "contentful";
import Image from "next/image";
import { FadedContent } from "./_components/Content";
import { Metadata } from "next";
import { BlogPostPageParams } from "../page";


export const dynamic = "force-dynamic";

export default async function Page({ params }:BlogPostPageParams) {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!,
  });

  const post = (await client.getEntry(params.id)).fields;

  const cover = post.cover as Entry<EntrySkeletonType> | Asset | undefined;
  const file = cover?.fields.file as unknown as {url:string}
  const url =
    cover && "fields" in cover && "file" in cover.fields
      ? "https:" + file?.url
      : undefined;

  return (
    <section>
      <div className="flex justify-center items-center h-[400px] bg-black">
        {url ? (
          <Image
            src={url}
            alt={post.title as unknown as string}
            width={1000}
            height={600}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/images/WDS LOGO WHITE.png"
            alt={post.title as unknown as string}
            width={200}
            height={200}
            className="opacity-50"
          />
        )}
      </div>

      <FadedContent title={post.title as unknown as string} content={post.content as unknown as string} />
    </section>
  );
}

export async function generateMetadata(
  { params }: BlogPostPageParams
): Promise<Metadata> {
       const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!,
  });
  const post = (await client.getEntry(params.id)).fields;

  const cover = post.cover as Entry<EntrySkeletonType> | Asset | undefined;
    const file = cover?.fields.file as unknown as {url:string}

  const url =
    cover && "fields" in cover && "file" in cover.fields
      ? "https:" + file?.url
      : "/images/default-cover.jpg";

  return {
    title: post.title as unknown as string,
    description: post.description as unknown as string,
    openGraph: {
      title: post.title as unknown as string,
      description: post.description as unknown as string,
      images: [url],
    },
  };
}
