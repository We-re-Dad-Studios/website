import { getAllChapterParams, getChapterByNumber, getChapterBySlug, getNovelChapterNumbers } from "@/lib/contentful";
import { getOnSiteChapterLimit, getRoyalRoadLink, ROYAL_ROAD_TEASER_BLOCKS } from "@/lib/royal-road";
import { redirect } from "next/navigation";
import { Chapter, Content } from "./_components/FadedContent";
import { Document } from "@contentful/rich-text-types";
import { Metadata } from "next";

// Pre-render every published chapter at build time; new chapters not in this
// list still render on demand (dynamicParams) and are cached thereafter.
// Pages refresh via the Contentful webhook (/api/revalidate) or this fallback.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllChapterParams();
}

export default async function Page(props:{params:Promise<{chapterSlug:string,slug:string}>}) {
    const {chapterSlug,slug}= await props.params;
    const [chapterContent, chapterNumbers] = await Promise.all([
        getChapterBySlug(chapterSlug),
        getNovelChapterNumbers(slug),
    ]);
    const [nextChapter, prevChapter] = await Promise.all([
        getChapterByNumber(chapterContent?.chapterNumber as number + 1, slug),
        getChapterByNumber(chapterContent?.chapterNumber as number - 1, slug),
    ]);
    if (!chapterContent) {
       redirect("/projects")
    }

    // Second half of the novel lives on Royal Road: only a teaser leaves the
    // server, so the full text is never in the page payload.
    const onSiteLimit = getOnSiteChapterLimit(slug, chapterNumbers);
    const royalRoadUrl = getRoyalRoadLink(slug);
    const onRoyalRoad = Boolean(royalRoadUrl) && chapterContent.chapterNumber > onSiteLimit;
    const fullDoc = chapterContent.content as unknown as Document;
    const doc: Document = onRoyalRoad
        ? { ...fullDoc, content: fullDoc.content.slice(0, ROYAL_ROAD_TEASER_BLOCKS) }
        : fullDoc;

    return (
        <div className="relative">

<Content
    previousChapter={prevChapter? (prevChapter as unknown as Chapter).slug:undefined}
    nextChapter={nextChapter? (nextChapter as unknown as Chapter).slug:undefined}
    content={doc}
    chapter={{ ...chapterContent, content: doc } as unknown as Chapter}
    royalRoad={onRoyalRoad ? { url: royalRoadUrl as string, onSiteLimit } : undefined}
/>

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
