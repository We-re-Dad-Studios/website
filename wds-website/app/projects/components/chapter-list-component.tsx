import Link from "next/link"
import { getOnSiteChapterLimit } from "@/lib/royal-road"
type chapter={
  id:string,slug:string,title:string,chapterNumber:number|string,isFree:boolean,releaseDate:string
}

export const ChapterListComponent= ({chapters,projectSlug}:{chapters:chapter[],projectSlug:string})=>{
    // Chapters past the on-site half open as a teaser that hands off to Royal Road.
    const onSiteLimit = getOnSiteChapterLimit(
      projectSlug,
      Array.isArray(chapters) ? chapters.map((c) => Number(c.chapterNumber)) : []
    )
    if (!Array.isArray(chapters) || chapters.length === 0) {
      return (
        <p className="m-0 bg-brand-indigo px-4 py-3 text-center text-[18px] font-bold uppercase tracking-[0.08em] text-white">
          Chapters coming soon
        </p>
      )
    }
    return(
          <ol className="m-0 max-h-[420px] list-none overflow-y-auto p-0 pr-1 scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent">
            {chapters.map((chapter) => {
              const onRoyalRoad = Number(chapter.chapterNumber) > onSiteLimit
              return (
              <li key={chapter.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/novels/${projectSlug}/chapters/${chapter.slug}`}
                  className="group flex items-center gap-3 px-1 py-3 transition-colors hover:bg-foreground/5"
                >
                  <span className="w-12 shrink-0 font-plaguard text-[20px] leading-none text-primary-0">
                    {String(chapter.chapterNumber).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[19px] font-bold leading-tight text-foreground">
                      {chapter.title}
                    </span>
                    <span className="mt-0.5 block text-[15px] text-wds-text-secondary">
                      {/* Fixed locale + the studio's zone (WAT, as releases are entered) so server and client match */}
                      {new Date(chapter.releaseDate).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric", timeZone: "Africa/Lagos" })}
                    </span>
                  </span>
                  {onRoyalRoad ? (
                    <span className="shrink-0 bg-brand-indigo px-2 py-0.5 text-[13px] font-bold uppercase tracking-[0.08em] text-white">
                      Royal Road
                    </span>
                  ) : chapter.isFree ? (
                    <span className="shrink-0 border border-primary-0 px-2 py-0.5 text-[13px] font-bold uppercase tracking-[0.08em] text-primary-0">
                      Free
                    </span>
                  ) : null}
                </Link>
              </li>
            )})}
          </ol>
    )
}
