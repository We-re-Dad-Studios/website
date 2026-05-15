import { getChapterByNumber, getChapterBySlug } from "@/lib/contentful";
import { redirect } from "next/navigation";
import { Chapter, Content } from "./_components/FadedContent";
import { Document } from "@contentful/rich-text-types";
import { Metadata } from "next";

export default async function Page(props:{params:Promise<{chapterSlug:string,slug:string}>}) {
    const {chapterSlug,slug}= await props.params;
    const chapterContent = await getChapterBySlug(chapterSlug);
    const [nextChapter, prevChapter] = await Promise.all([
        getChapterByNumber(chapterContent?.chapterNumber as number + 1, slug),
        getChapterByNumber(chapterContent?.chapterNumber as number - 1, slug),
    ]);
    if (!chapterContent) {
       redirect("/projects")
    }
    return (
        <div className="relative">
           
<Content previousChapter={prevChapter? (prevChapter as unknown as Chapter).slug:undefined} nextChapter={nextChapter? (nextChapter as unknown as Chapter).slug:undefined} content={chapterContent.content as unknown as Document} chapter={chapterContent as unknown as Chapter}/>

        </div>
    );
}

export const generateMetadata = async (props: { params: Promise<{ chapterSlug: string,slug:string }> }):Promise<Metadata> => {
    const {chapterSlug,slug}= await props.params;
    const chapterContent = await getChapterBySlug(chapterSlug);

    const pageTitle = `${chapterContent?.title} | ${slug.replace(/-/g, " ")[0].toUpperCase()}${slug.replace(/_/g, " ").slice(1)}`;
    const desc = chapterContent?.previewText as string || "Read more about this chapter by clicking the link.";

    return {
        title: pageTitle,
        description: desc,
        openGraph: {
            title: pageTitle,
            description: desc,
            url: `https://weredadstudios.com/novels/${slug}/chapters/${chapterSlug}`,
            siteName: "We're Dad Studios",
            images: [
                {
                    url: "https://weredadstudios.com/images/WDS%20LOGO%20BLACK_.png",
                    width: 1200,
                    height: 630,
                    alt: pageTitle,
                },
            ],
        },
        alternates: { canonical: `https://weredadstudios.com/novels/${slug}/chapters/${chapterSlug}` },
    }


}