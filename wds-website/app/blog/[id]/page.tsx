"use server";
import { Asset, createClient, Entry, EntrySkeletonType } from "contentful";
import { FadedContent } from "./_components/Content";
import Image from "next/image";
import { Metadata } from "next";

export default async function Page(props:{params: Promise<{id:string}>}) {
    const params = await props.params;
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
    const post = (await client.getEntry(params.id)).fields;

    const coverField = post?.cover as Entry<EntrySkeletonType> | Asset | undefined;

    // Check if coverField is an Asset (which has a file and URL)
    const url = coverField && "fields" in coverField && "file" in coverField.fields 
      ? (coverField.fields.file as { url: string }).url
      : undefined;


    return (
        <section>
            <div className="flex items-center justify-center w-full h-[400px] relative overflow-hidden">
            {
                url?<Image src={url.startsWith("//")?"https:"+url:url} alt={`${post.title}`+"Cover"} width={500} height={500} className="max-w-full aspect-video w-full object-top h-full object-contain"/>: <Image src={"/images/WDS LOGO WHITE.png"} alt={post.title + " image"} width={100} height={100} className='w-[50%] ' />

            }
            </div>
          
            <FadedContent title={post.title as string} content={post.content as string}/>
        </section>
    );
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
    const post = (await client.getEntry(params.id)).fields;

    const coverField = post?.cover as Entry<EntrySkeletonType> | Asset | undefined;
    const coverUrl = coverField && "fields" in coverField && "file" in coverField.fields 
        ? `https:${(coverField.fields.file as { url: string }).url}`
        : "/images/default-cover.jpg"; // Fallback image

    return {
        title: `${post.title} | Dawnshipper`,
        description: post.description as string || "Read more about this character in the world of Dawnshipper.",
        openGraph: {
            title: `${post.title} | Dawnshipper`,
            description: post.description  as string || "Explore the lore of Dawnshipper.",
            url: `https://weredadstudios.netlify.app/blog/${params.id}`,
            siteName: "Dawnshipper",
            images: [
                {
                    url: coverUrl,
                    width: 1200,
                    height: 630,
                    alt: `${post.title} - Dawnshipper`,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: `${post.title} | Dawnshipper`,
            description: post.description  as string|| "Explore the lore of Dawnshipper.",
            images: [coverUrl],
        },
    };
}