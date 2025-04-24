"use client";
import { Search, SlidersHorizontalIcon, X } from "lucide-react"
import { useEffect, useState } from "react";
import { Entry, EntrySkeletonType } from "contentful";
import { useContentfulClient } from "@/hooks/useContentfulClient";
import Image from "next/image";
import Link from "next/link";

const Projects =  () => {
    const [tags, setTags] = useState<Entry<EntrySkeletonType,undefined,string>[]>([]);
    const [currentTag, setCurrentTag] = useState<{name:string,id:string|undefined}>();
    const [search,setSearch]=useState<string>("")
   
   
    const client= useContentfulClient();
    const getProjects = async()=>{
      
        if(client){
           
            if(!currentTag){
              const projects = (await client.getEntries({content_type:process.env.NEXT_PUBLIC_BLOGS_ID!})).items;
              return projects
           }
           else{
              const projects = (await (client.getEntries({content_type:process.env.NEXT_PUBLIC_BLOGS_ID!,'fields.tags.sys.id':currentTag.id}))).items;
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
         client.getEntries({content_type:process.env.NEXT_PUBLIC_POST_TAG_ID!}).then((resp)=>{
            setTags(resp.items);
         });
    
    },[])
  return (
    <div className="w-full">
         <div className=' flex w-full justify-between [&>*]:text-[12px] [&>*]:cursor-pointer pb-10'>
        <div className="flex items-center gap-2">
        <div className='flex gap-x-3 [&>*]:bg-white [&>*]:bg-opacity-10 [&>*]:transition-all  [&>*:hover]:scale-110 [&>*]:bounce [&>*:hover]:bg-primary-0 [&>*]:h-max [&>*]:rounded-md  [&>*]:px-5 [&>*]:py-2'>
          {
            Array.isArray(tags) && tags.length>0&& tags.map((tag) => {
                if(tag.fields.name){
                  return <div key={tag.sys.id} role="button" className={tag.fields.name === currentTag?.name ? 'bg-primary-0 bg-opacity-10 rounded-md px-3 py-1 text-primary-0 font-semibold' : 'bg-white bg-opacity-10 rounded-md px-3 py-1'} onClick={() => setCurrentTag({name:tag.fields.name as unknown as string,id:tag.sys.id})}>
                  {tag.fields.name as unknown as string}
              </div>
                }
})
          }
          
        </div>
        <button onClick={()=>{setCurrentTag({name:"",id:undefined})}} className="w-max ml-2 h-max p-1.5 flex items-center justify-center bg-primary-0 text-white rounded">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className='flex gap-4 ml-3 [&>*]:flex [&>*]:gap-x-3 [&>*]:items-center [&>*]:bg-white [&>*]:rounded-md [&>*]:bg-opacity-10 [&>*]:px-3'>
          <div className='bg'>
            <Search />
            <input type="text"  className='bg-transparent focus:outline-none outline-none' onChange={(e)=>{setSearch(e.target.value.trim())}} />
          </div>
          <div>
            <SlidersHorizontalIcon />
            <p>Filter</p>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-6 md:justify-evenly mx-auto justify-center'>
          {Array.isArray(projects) && projects.length>0 && projects.filter((project)=>(project.fields.title as string).toLowerCase().includes(search)).map((post) => 
             <ProjectCard key={post.sys.id} name={post.fields.title as string} description={post.fields.description as string} to={`/blog/${post.sys.id}`}/>


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
const ProjectCard = ({  name, description, to }: {  name: string, description: string, to:string }) => {
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

export default Projects