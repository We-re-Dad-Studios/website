import { getChapterBySlug } from "@/lib/contentful";
import { redirect } from "next/navigation";
import { Chapter, Content } from "./_components/FadedContent";
import { Document } from "@contentful/rich-text-types";
import { Metadata } from "next";

export default async function Page(props:{params:Promise<{chapterSlug:string}>}) {
    const {chapterSlug}= await props.params;
    const chapterContent = await getChapterBySlug(chapterSlug);
    if (!chapterContent) {
       redirect("/projects")
    }
    return (
        <div>
<Content content={chapterContent.content as unknown as Document} chapter={chapterContent as unknown as Chapter}/>
        </div>
    );
}

export const generateMetadata = async (props: { params: Promise<{ chapterSlug: string,slug:string }> }):Promise<Metadata> => {
    const {chapterSlug,slug}= await props.params;
    const chapterContent = await getChapterBySlug(chapterSlug);

    return {
        title: `${chapterContent?.title} | Dawnshipper`,
        description: chapterContent?.previewText as string || "Read more about this chapter by clicking the link.",
        openGraph: {
            title: `${chapterContent?.title} | Dawnshipper`,
            description: chapterContent?.previewText as string || "Read more about this chapter by clicking the link.",
            url: `https://weredadstudios.com/projects/${slug}/chapters/${chapterSlug}`,
            siteName: "Dawnshipper",
            images: [
                {
                    url: "https://weredadstudios.netlify.app/images/WDS%20LOGO%20BLACK_.png",
                    width: 1200,
                    height: 630,
                    alt: `${chapterContent?.title as string} | Dawnshipper`,
                },
            ],
        },

    }


}