import { getChapterBySlug } from "@/lib/contentful";
import { redirect } from "next/navigation";
import { Chapter, Content } from "./_components/FadedContent";
import { Document } from "@contentful/rich-text-types";

export default async function Page(props:{params:Promise<{chapterSlug:string}>}) {
    const {chapterSlug}= await props.params;
    const chapterContent = await getChapterBySlug(chapterSlug);;
    if (!chapterContent) {
       redirect("/projects")
    }
    return (
        <div>
<Content content={chapterContent.content as unknown as Document} chapter={chapterContent as unknown as Chapter}/>
        </div>
    );
}