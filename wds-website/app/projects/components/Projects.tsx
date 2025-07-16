"use client";
import { Search, SlidersHorizontalIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { Entry, EntrySkeletonType } from "contentful";
import { useContentfulClient } from "@/hooks/useContentfulClient";

import Link from "next/link";
import Image from "next/image";

const Projects =  () => {
    const [tags, setTags] = useState<Entry<EntrySkeletonType,undefined,string>[]>([]);
    const [currentTag, setCurrentTag] = useState<{name:string,id:string}>();

   
   
    const client= useContentfulClient();
    const getProjects = async()=>{
      
        if(client){
           
            if(!currentTag){
              const projects = (await client.getEntries({content_type:process.env.NEXT_PUBLIC_PROJECTS_ID!})).items;
              return projects
           }
           else{
              const projects = (await (client.getEntries({content_type:process.env.NEXT_PUBLIC_PROJECTS_ID!,'fields.tags.sys.id':currentTag.id}))).items;
              return projects;
           }
        }
        return [];
        
    }
    const [projects,setProjects]= useState<Entry<EntrySkeletonType,undefined,string>[]>();
    useEffect(()=>{
        getProjects().then((resp)=>{
        setProjects(resp);
        }).catch(()=>{
            // console.log(err)
        })
    },[currentTag])
    useEffect(()=>{
         client.getEntries({content_type:process.env.NEXT_PUBLIC_TAGS_ID!}).then((resp)=>{
            setTags(resp.items);
         });
    
    },[])
  return (
    <div className="w-full">
         <div className=' flex w-full justify-between [&>*]:text-[12px] [&>*]:cursor-pointer pb-10'>
       <div className="flex   flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 pb-10">
  {/* Tags */}
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <button
        key={tag.sys.id}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          tag.fields.name === currentTag?.name
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-white/10 text-gray-200 hover:bg-white/20'
        }`}
        onClick={() => setCurrentTag({name: tag.fields.name as unknown as string, id: tag.sys.id})}
      >
        {tag.fields.name as unknown as string}
      </button>
    ))}
  </div>

  {/* Search/Filter */}
  <div className="flex gap-3 w-full md:w-auto">
    <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
      <Search className="w-4 h-4 text-gray-400" />
      <input 
        type="text" 
        placeholder="Search projects..." 
        className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
      />
    </div>
    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 text-sm transition-all">
      <SlidersHorizontalIcon className="w-4 h-4" />
      <span>Filter</span>
    </button>
  </div>
</div>
      </div>
      <div className="grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5 gap-6">
          {Array.isArray(projects) && projects.length>0 && projects.map((project) => 
            <ProjectCard key={project.sys.id} to={project.fields.useInternalRoute?project.fields.to as string:`/project/${project.sys.id}`} image={null} name={project.fields.name as unknown as string} description={project.fields.description as unknown as string} type={currentTag?.name as string}/>


          )}
      </div>
      <div className='flex gap-5 items-center [&>*]:text-[12px] [&>*]:cursor-pointer py-10'>
        <div className='text-gray-600'>Prev</div>
        <div className='flex gap-3 [&>*]:px-4 [&>*]:py-2 [&>*]:transition-all [&>*:hover]:bg-primary-0  [&>*]:bg-white [&>*]:bg-opacity-10 [&>*]:rounded-md [&>*]:border [&>*]:border-gray-700 '>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        </div>
        <div>Next</div>
        </div>
    </div>
  )
}
 const ProjectCard = ({
  image,
  name,
  description,
  type,
  to,
}: {
  image: string | null;
  name: string;
  description: string;
  type: string;
  to: string;
}) => {
  return (
     <div className="relative  col-span-1  h-[420px] md:h-[480px] rounded-xl border-2 border-neutral-700 overflow-hidden group transition-all duration-300 hover:border-primary-0 hover:scale-[1.02]">
      {/* Image Background */}
      <div className="absolute inset-0 bg-neutral_900">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-300"
          />
        ) : (
          <div className="grid place-items-center h-full">
            <p className="text-3xl font-agdasima text-white/30">
              Coming Soon
            </p>
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/30 to-transparent">
        <div className="transform  translate-y-4 md:translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl md:text-3xl font-bold text-white">{name}</h3>
            {type && (
              <span className="text-xs px-2 py-1 bg-primary-0 rounded-full text-white uppercase tracking-wider">
                {type}
              </span>
            )}
          </div>

          <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3 group-hover:line-clamp-5 transition-all duration-300 mb-4">
            {description}
          </p>

          <Link
            href={to}
            className="mt-3 w-full py-2 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-neutral_1000 transition-all duration-300 text-center block text-white"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>

  );
};
export default Projects