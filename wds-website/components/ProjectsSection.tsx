import React from 'react'
import projects from "@/cached/newProjects.json"
import Image from 'next/image'
import Link from 'next/link'
export const ProjectsSection = () => {
    // const data: TMockData = useFetchMockData(50, 1, 'manga')

    // if (!data.loading) console.log(data);

    return (
        <section className='py-16 flex flex-col overflow-hidden items-center px-4 bg-neutral_1000 my-4'>
            <h1 className='text-heading'>
                YOUR JOURNEY BEGINS HERE !
            </h1>
            <p className='w-[520px] max-w-full text-subheading mt-8 text-justify'>Discover a world filled with thoughtfully curated projects, ranging from thrilling games and captivating novels, manga, manhwa, and animations.</p>
            <section className="mt-12 overflow-x-auto flex w-[100vw] gap-x-4 justify-start px-[20px] lg:px-[80px] py-2">
                {
                    projects.map(project => <ProjectCard to={ project.to?project.to:"/"} key={project.name} {...project} />)
                }

            </section>
        </section>
    )
}


export const ProjectCard = ({ image, name, description, type,to }: { image: string | null, name: string, description: string, type: string,to:string }) => {
    return (
        <div className='flex-shrink-0 w-[300px] lg:mx-0 mx-auto  h-[950px] md:h-[450px] max-h-[43vh]  relative rounded-tr-xl group border border-neutral-50/30 overflow-hidden '>
            {
                image ? (
                    <Image src={image} alt={name + " image"} width={1000} className='w-full h-full' />
                ) : (
                    <div className='w-full h-full bg-neutral_900 rounded-tr-lg grid place-items-center'>
                        <p className='text-[35px] whitespace-nowrap font-agdasima setfont'>Coming Soon</p>
                    </div>
                )
            }
            <div className="absolute z-[2] w-full h-full top-0 left-0  group items-center flex flex-col justify-end  hover:gap-x-[100%] [&>div>Button]:hover:[&>.description]:line-clamp-none  [&>div>Button]:hover:relative [&>div>Button]:hover:opacity-100 [&>div]:hover:h-[100%] [&>div]:hover:bg-opacity-20 [&>div]:hover:backdrop-blur-sm cursor-pointer">
                <div className='flex flex-col h-[40%] p-2  transition-all  duration-500 justify-between bg-primary-0 bg-opacity-0 bounce'>
                    <div>
                        <div className="flex items-center justify-between">
                            <p className='mt-auto text-[28px] font-agdasima '>{name}</p>
                            <p className='text-[10px] w-max px-2 h-max py-1 rounded-sm bg-[#F94C10] hidden'>{type}</p>
                        </div>
                        <div className='opacity-50  text-lg w-[85%] transition-opacity group-hover:line-clamp-[10] line-clamp-4'>
                            <p className='description'>{description}</p>

                        </div>
                    </div>
                   
                   <button className='w-full py-2 my-3 border border-white rounded-md font-agdasima text-[18px] hover:text-primary-0 hover:bg-white hover:font-[700] z-[6]  opacity-0 transition-all duration-700'><Link prefix='/projects' className='block' prefetch href={to}>See More</Link></button>
                  
                </div>


            </div>

        </div>
    )
}