"--force-dynamic";
import { createClient } from "contentful";
import {Main} from "./_components/main"
import { getChapterList } from "@/lib/contentful";
import { Document } from "@contentful/rich-text-types";

export interface chapter  {
    id: string;
    title: string;
    slug: string;
    chapterNumber: number;
    volumeNumber: number;
    releaseDate: string;
    isFree: boolean;
    previewText: string;
    content:Document
}

  async function Page() {
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
    const chapters = await getChapterList("4HGkx2kqLJVyRRbFU3QUkB") as chapter[];

    const relatedPosts = (await client.getEntries({
        content_type:process.env.NEXT_PUBLIC_BLOGS_ID!,
        limit: 7,
        'fields.tags.sys.id':'43UEsDhn9X19AvFj1jxqos',
    })).items
    return (
       <div>
        <Main relatedPosts={relatedPosts} chapters={chapters}/>
       </div>
    );
}
export default Page;

