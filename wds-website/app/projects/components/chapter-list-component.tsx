import Link from "next/link"
import { chapter } from "../dawnshipper/page"

export const ChapterListComponent= ({chapters,projectSlug}:{chapters:chapter[],projectSlug:string})=>{
    return(
          <div className="space-y-4 max-h-[300px] overflow-y-auto w-full pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {Array.isArray(chapters)&&chapters.length>0?chapters.map((chapter) => (
              <div 
                key={chapter.id}
                className="group relative p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-l-4 border-amber-500 hover:border-primary-0 transition-all duration-300 rounded-r-lg hover:shadow-[0_0_15px_-3px_rgba(249,76,16,0.3)]"
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <Link 
                      href={`/novels/${projectSlug}/chapters/${chapter.slug}`} 
                      className="text-xl font-mono font-medium text-amber-100 group-hover:text-primary-0 transition-colors"
                    >
                      {chapter.title}
                    </Link>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-xs font-mono px-2 py-1 bg-gray-700/50 text-amber-300 rounded group-hover:bg-primary-0/20 group-hover:text-white transition-colors">
                        Ch. {chapter.chapterNumber}
                      </span>
                      {chapter.isFree && (
                        <span className="text-xs font-mono px-2 py-1 bg-amber-800/30 text-amber-200 rounded border border-amber-700/50 group-hover:border-primary-0/50 group-hover:text-primary-0 transition-colors">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-400 group-hover:text-white transition-colors">
                      {new Date(chapter.releaseDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-mono mt-1 text-gray-500 group-hover:text-gray-300 transition-colors">
                      {new Date(chapter.releaseDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )): <div className="bg-primary-0 grid place-items-center  mx-auto hover:bg-primary-0/50 transition-colors duration-500 w-[70%] h-auto py-2  rounded-lg">
                 Chapters coming soon...
             </div>}
          </div>
    )
}