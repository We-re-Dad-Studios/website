"use client";
import { Search, SlidersHorizontalIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { Entry, EntrySkeletonType } from "contentful";
import { useContentfulClient } from "@/hooks/useContentfulClient";
import { ProjectCard } from "@/components/ProjectsSection";

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
        }).catch((err)=>{
            console.log(err)
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
       <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 pb-10">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

export default Projects