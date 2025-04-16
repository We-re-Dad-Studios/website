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
        <div className='flex gap-x-3 [&>*]:bg-white [&>*]:bg-opacity-10 [&>*]:transition-all  [&>*:hover]:scale-110 [&>*]:bounce [&>*:hover]:bg-primary-0 [&>*]:h-max [&>*]:rounded-md  [&>*]:px-5 [&>*]:py-2'>
          {
            Array.isArray(tags) && tags.length>0&& tags.map((tag) => (
                <div key={tag.sys.id} role="button" className={tag.fields.name === currentTag?.name ? 'bg-primary-0 bg-opacity-10 rounded-md px-3 py-1 text-primary-0 font-semibold' : 'bg-white bg-opacity-10 rounded-md px-3 py-1'} onClick={() => setCurrentTag({name:tag.fields.name as unknown as string,id:tag.sys.id})}>
                    {tag.fields.name as unknown as string}
                </div>
            ))
          }
        </div>
        <div className='flex gap-4 ml-3 [&>*]:flex [&>*]:gap-x-3 [&>*]:items-center [&>*]:bg-white [&>*]:rounded-md [&>*]:bg-opacity-10 [&>*]:px-3'>
          <div className='bg'>
            <Search />
            <input type="text" name="" id="" className='bg-transparent outline-transparent' />
          </div>
          <div>
            <SlidersHorizontalIcon />
            <p>Filter</p>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-6 justify-center'>
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