import React from 'react'
import projects from "@/cached/newProjects.json"
import Image from 'next/image'
export const ProjectsSection = () => {
  return (
    <section className='py-16 flex flex-col items-center px-4 bg-neutral_1000 my-4'>
        <h1 className='text-heading'>
            YOUR JOURNEY BEGINS HERE !
        </h1>
        <p className='w-[520px] max-w-full text-subheading mt-8 text-justify'>Discover a world filled with thoughtfully curated projects, ranging from thrilling games and captivating novels, manga, manhwa, and animations.</p>
        <div className="mt-12 w-full overflow-x-auto flex-nowrap flex justify-start gap-x-4 px-[80px]">
            {
                projects.map(project=><ProjectCard key={project.name} {...project}/>)
            }
        </div>
    </section>
  )
}


const ProjectCard=({image,name,description,type}:{image:string|null,name:string,description:string,type:string})=>{
    return(
        <div className='w-[320px] h-[450px] max-h-[40vh] relative rounded-tr-lg group overflow-hidden' >
            {
                image?<Image src={image} alt={name + "image"} width={1000} className='w-full h-full' />:<div className='w-full h-full bg-neutral_900 rounded-tr-lg grid place-items-center'>
                    <p className='text-[35px]'>Coming Soon</p>
                    </div>
            }
           <div className="absolute z-[2] w-full h-full top-0 left-0 p-2 flex flex-col ">
             <div className="flex items-center justify-between mt-auto">
             <p className='mt-auto text-[32px]'>{name}</p>
             <p className='text-[16px] w-max px-2 h-max py-1 rounded-sm  bg-[#F94C10]'>{type}</p>
             </div>

           </div>
           <div className="absolute z-[4] backdrop-blur-md h-full w-full transition-all  bg-primary-0/50 duration-500 top-[110%] group-hover:top-0 left-0 ">
            <div className='opacity-0 group-hover:opacity-100  duration-700 transition-opacity p-2'>
                <p>{description}</p>
            <button className='w-full py-2 my-3 border-2 border-white rounded-md text-[24px] hover:bg-primary-0 hover:text-white transition-colors z-[6]'>See More</button>
            </div>
                
            </div>
        </div>
    )
}