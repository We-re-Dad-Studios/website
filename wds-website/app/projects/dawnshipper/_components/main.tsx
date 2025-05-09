"use client"
import { withFadeIn } from "@/utils/withFadeIn";
import { Entry, EntrySkeletonType } from "contentful";
import { InstagramIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { chapter } from "../page";

  function NotMain({relatedPosts,chapters}:{relatedPosts:Entry<EntrySkeletonType,undefined,string>[],chapters:chapter[]}) {
    return (
        <div>
          <div className="flex lg:flex-row flex-col w-full h-full pb-10">
             <div className="flex flex-col  lg:w-[50%]">
          <div className="flex h-[45px]  mb-2">
          <p className="text-white text-heading mt-auto leading-none">Dawnshipper</p>
          <span className="block w-max px-2 py-1 ml-auto mt-auto h-max text-sm bg-[#F94C10] text-white rounded">
             Novel
          </span>
          </div>
                <div className="w-full max-h-[450px] overflow-hidden rounded-md">
                <Image src={"https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png"} className="w-full h-auto object-top" alt="Dawnshipper cover" width={500} height={500}/>
                </div>
 
                <p className="text-sm font-semibold mt-4 mb-2">
                 Genre
                </p>
                <div className="flex items-center gap-3 font-semibold text-xs">
                <span className="bg-white/10 rounded text-white w-max block p-2">
                 Dark Epic Fantasy
                </span>
                <span className="bg-white/10 rounded text-white w-max block p-2">
                 Fantasy Tech
                </span>
                <span className="bg-white/10 rounded text-white w-max block p-2">
                 Academy Fantasy
                </span>
                </div>
 
                <p className="text-subheading tracking-wider text-neutral_400 font-semibold mt-4">
                 Description
                </p>
                <p className="text-xl mb-8 mt-3 text-justify leading-relaxed text-white tracking-wider">
                In the world of Thaloria, power is everything. Humans have learned to wield elemental magic by forming connections with Echoes—semi-sentient conduits of magic. The dominant houses of Sinai, Lothara, Baridi, and Umbralis are on the brink of a significant crisis, as the threat of civil war looms over their longstanding alliance. However, beneath this shifting political landscape lies an even more insidious plot that threatens all life in Thaloria.

Amidst this chaos, Devvyn, a lowborn troublemaker, bonds with Flux, the Echo of Chaos. This relationship transforms him into a living contradiction, granting him unpredictable powers that challenge the established limits of magic.

As tensions rise and circumstances change across the continent, Devvyn finds himself at the center of a deep-rooted conflict connected to his family’s lost legacy. Alongside new friends he meets at GoldLeaf Academy and with old enemies emerging from the shadows, Devvyn must determine whether he will become Thaloria’s savior or the spark that ignites its downfall.
                </p>
             </div>
             <div className="flex flex-col items-center w-full lg:w-[30%] ml-auto">
             <p className="text-subheading font-semibold mb-2 h-[45px]">
                 Ready to dive in?
             </p>
             <div className="space-y-4 max-h-[300px] overflow-y-auto w-full">
  {chapters.map((chapter) => (
    <div 
      key={chapter.id}
      className="group relative p-4 bg-gradient-to-r from-gray-900/80 w-full md:w-[80%] mx-auto to-gray-800/80 border-l-4 border-amber-500 hover:border-amber-300 transition-all duration-300 rounded-r-lg shadow-lg hover:shadow-amber-500/20 hover:translate-x-1"
    >
      <div className="flex justify-between items-center gap-3">
        <div>
          <Link href={`/novels/dawnshipper/chapters/${chapter.slug}`} className="text-xl font-mono font-medium text-amber-100 group-hover:text-white transition-colors">
            {chapter.title}
          </Link>
          <div className="flex items-center mt-1 space-x-3">
            <span className="text-xs font-mono px-2 py-1 bg-gray-700/50 text-amber-300 rounded">
              Ch. {chapter.chapterNumber}
            </span>
            {chapter.isFree && (
              <span className="text-xs font-mono px-2 py-1 bg-amber-800/30 text-amber-200 rounded border border-amber-700/50">
                Free
              </span>
            )}
          </div>
        </div>
        <div className="text-right ">
          <p className="text-sm font-mono text-gray-400">
            {new Date(chapter.releaseDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-xs font-mono mt-1 text-gray-500 group-hover:text-gray-400 transition-colors">
            {new Date(chapter.releaseDate).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
     
    </div>
  ))}
</div>
             {/* <button className="bg-primary-0 hover:bg-primary-0/50 transition-colors duration-500 w-[70%] h-auto py-2  rounded-lg">
                 Chapters coming soon...
             </button> */}
 
             <div className="mt-[50px] bg-white/10 py-4 px-8 rounded text-center" >
                 <p className=" font-semibold">
                     Follow Us
                 </p>
                 <div className="flex items-center justify-evenly mt-6">
                 <a href="/projects/dawnshipper"  className="w-[30px] h-[30px]">
                     <TwitterIcon className="w-6 h-6"/>
                 </a>
                 <a href="/projects/dawnshipper"  className="w-[30px] h-[30px]">
                     <InstagramIcon className="w-6 h-6"/>
                 </a>
                
                 </div>
             </div>
             </div>
 
         </div>
         <p className="text-center text-subheading font-semibold mb-4">
             Related Posts
         </p>
 
         <div className="mt-4 mb-8 flex mx-auto justify-center lg:items-start gap-4 flex-wrap">
             {
                 relatedPosts.map((post)=>
                 <ProjectCard key={post.sys.id} name={post.fields.title as string} description={post.fields.description as string} to={`/blog/${post.sys.id}`}/>
                 )
             }
         </div>
        </div>
    )
}


export const ProjectCard = ({  name, description, to }: {  name: string, description: string, to:string }) => {
    return (
        <div className='flex-shrink-0 w-[300px]  h-[950px] md:h-[450px] max-h-[43vh]  relative rounded-tr-xl group border border-neutral-50/30 overflow-hidden '>
           
                    <Image src={"/images/WDS LOGO WHITE.png"} alt={name + " image"} width={100} height={100} className='w-full h-full' />
               
            
            <div className="absolute z-[2] w-full h-full top-0 left-0  group items-center flex flex-col justify-end  hover:gap-x-[100%] [&>div>Button]:hover:[&>.description]:line-clamp-none  [&>div>Button]:hover:relative [&>div>Button]:hover:opacity-100 [&>div]:hover:h-[100%] [&>div]:bg-opacity-10 [&>div]:hover:bg-opacity-20 [&>div]:hover:backdrop-blur-sm cursor-pointer">
                <div className='flex flex-col h-[40%] p-2  transition-all  duration-500 justify-between bg-primary-0 bg-opacity-0 bounce'>
                    <div>
                        <div className="flex items-center justify-between">
                            <p className='mt-auto text-[28px] font-agdasima  line-clamp-2   '>{name}</p>
                            
                        </div>
                        <div className='opacity-50  text-[10px]  transition-opacity group-hover:line-clamp-[10] line-clamp-4 w-full'>
                            <p className='description'>{description}</p>

                        </div>
                    </div>
                   
                   <button className='w-full py-2 my-3 border border-white rounded-md font-agdasima text-[18px] hover:text-primary-0 hover:bg-white hover:font-[700] z-[6]  opacity-0 transition-all duration-700'><Link className='block' prefetch href={to}>See More</Link></button>
                  
                </div>


            </div>

        </div>
    )
}

export const Main = withFadeIn(({ relatedPosts,chapters }: { relatedPosts: Entry<EntrySkeletonType, undefined, string>[],chapters:chapter[] }) => (
    <NotMain relatedPosts={relatedPosts} chapters={chapters}/>
));
