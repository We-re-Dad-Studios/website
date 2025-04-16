"use client"
import { withFadeIn } from "@/utils/withFadeIn";
import { Entry, EntrySkeletonType } from "contentful";
import { InstagramIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

  function NotMain({relatedPosts}:{relatedPosts:Entry<EntrySkeletonType,undefined,string>[]}) {
    return (
        <div>
          <div className="flex lg:flex-row flex-col w-full h-full pb-10">
             <div className="flex flex-col  lg:w-[50%]">
          <div className="flex h-[45px]  mb-2">
          <p className="text-white text-heading mt-auto leading-none">Project Osiris</p>
          <span className="block w-max px-2 py-1 ml-auto mt-auto h-max text-sm bg-[#F94C10] text-white rounded">
             Novel
          </span>
          </div>
                <div className="w-full flex justify-center items-center bg-white/10 p-2 h-[450px]  rounded-md">
                    <p className="text-3xl">
                        Coming Soon...
                    </p>
                </div>
 
                <p className="text-sm font-semibold mt-4 mb-2">
                 Genre
                </p>
                <div className="flex items-center gap-3 font-semibold text-xs">
                <span className="bg-white/10 rounded text-white w-max block p-2">
                 Science Fantasy
                </span>
                <span className="bg-white/10 rounded text-white w-max block p-2">
                 Supernatural Thriller
                </span>
                <span className="bg-white/10 rounded text-white w-max block p-2">
                 Dystopian
                </span>
                </div>
 
                <p className="text-subheading tracking-wider text-neutral_400 font-semibold mt-4">
                 Description
                </p>
                <p className="text-xl  tracking-wider mb-8 mt-3 text-justify text-neutral-200 bg-white/10 p-3 ">
                In the near future, death has become negotiable—but only for the rich.
Thanks to Osiris Inc., the world&apos;s first and only soul-retrieval company, anyone with enough money can be brought back from the dead—so long as their Time of Death hasn&apos;t exceeded 48 hours. 
Operating within a dangerous liminal realm known as the Light, elite operatives called Walkers are trained to extract souls before they cross into Purgatory, the point of no return.
But something in the Light is shifting. Missions are failing, entire Walker teams are vanishing without a trace. 
<br  className="my-3"/>

When seventeen-year-old Vania Illia&apos;s whole team is wiped out during a simple retrieval mission, leaving her as the sole survivor, she&apos;s quietly reassigned to Team Zero, a squad of seasoned Walkers sidelined for one reason or the other. 
No one believes her story, they think she&apos;s crazy. But as Vania begins to uncover the truth behind her survival, and the mysterious disappearances happening in the Light, She realizes the truth is far more ominous than she could have ever imagined.
                </p>
             </div>
             <div className="flex flex-col items-center w-full lg:w-[30%] ml-auto">
             <p className="text-subheading font-semibold mb-2 h-[45px]">
                 Ready to dive in?
             </p>
             <button className="bg-primary-0 hover:bg-primary-0/50 transition-colors duration-500 w-[70%] h-auto py-2  rounded-lg">
                 Chapters coming soon...
             </button>
 
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

export const Main = withFadeIn(({ relatedPosts }: { relatedPosts: Entry<EntrySkeletonType, undefined, string>[] }) => (
    <NotMain relatedPosts={relatedPosts} />
));
