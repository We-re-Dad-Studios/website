import Link from "next/link"
type chapter={
  id:string,slug:string,title:string,chapterNumber:number|string,isFree:boolean,releaseDate:string
}

export const ChapterListComponent= ({chapters,projectSlug}:{chapters:chapter[],projectSlug:string})=>{
    return(
          <div className="space-y-4 max-h-[300px] overflow-y-auto w-full pr-2 scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent">
            {Array.isArray(chapters)&&chapters.length>0?chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="group relative p-4 bg-foreground/5 hover:bg-foreground/[0.08] border-l-4 border-amber-500 hover:border-primary-0 transition-all duration-300 rounded-r-lg hover:shadow-[0_0_15px_-3px_rgba(249,76,16,0.3)]"
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <Link
                      href={`/novels/${projectSlug}/chapters/${chapter.slug}`}
                      className="text-xl font-mono font-medium text-amber-700 dark:text-amber-100 group-hover:text-primary-0 transition-colors"
                    >
                      {chapter.title}
                    </Link>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-xs font-mono px-2 py-1 bg-foreground/10 text-amber-600 dark:text-amber-300 rounded group-hover:bg-primary-0/20 group-hover:text-primary-0 transition-colors">
                        Ch. {chapter.chapterNumber}
                      </span>
                      {chapter.isFree && (
                        <span className="text-xs font-mono px-2 py-1 bg-amber-500/15 text-amber-700 dark:text-amber-200 rounded border border-amber-600/40 group-hover:border-primary-0/50 group-hover:text-primary-0 transition-colors">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {new Date(chapter.releaseDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-mono mt-1 text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                      {new Date(chapter.releaseDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )): <div className="bg-primary-0 text-white grid place-items-center  mx-auto hover:bg-primary-0/50 transition-colors duration-500 w-[70%] h-auto py-2  rounded-lg">
                 Chapters coming soon...
             </div>}
          </div>
    )
}
