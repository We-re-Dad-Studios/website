"use client";
import { Search, SlidersHorizontalIcon, X } from "lucide-react"
import { useEffect, useState } from "react";
import { Entry, EntrySkeletonType } from "contentful";
import { useContentfulClient } from "@/hooks/useContentfulClient";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion"
const Projects =  () => {
    const [tags, setTags] = useState<Entry<EntrySkeletonType,undefined,string>[]>([]);
    const [currentTag, setCurrentTag] = useState<{name:string,id:string|undefined}>();
    const [search,setSearch]=useState<string>("")
    const [isFilterOpen, setIsFilterOpen] = useState(false);
   
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
        }).catch(()=>{
            // console.log(err)
        })
    },[currentTag])
    useEffect(()=>{
         client.getEntries({content_type:process.env.NEXT_PUBLIC_POST_TAG_ID!}).then((resp)=>{
            setTags(resp.items);
         });
    
    },[])
  return (
    <div className="w-full">
      {/* Filter Controls */}
      <motion.div 
        className="flex flex-col md:flex-row w-full justify-between gap-4 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <motion.div 
            className="flex gap-2 flex-wrap"
            layout
          >
            {Array.isArray(tags) && tags.length > 0 && tags.map((tag) => {
              if(tag.fields.name) {
                return (
                  <motion.div
                    key={tag.sys.id}
                    role="button"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      tag.fields.name === currentTag?.name 
                        ? 'bg-primary-0 text-white shadow-lg' 
                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    }`}
                    onClick={() => setCurrentTag({name:tag.fields.name as unknown as string,id:tag.sys.id})}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {tag.fields.name as unknown as string}
                  </motion.div>
                )
              }
            })}
          </motion.div>
          
          {currentTag && (
            <motion.button 
              onClick={() => setCurrentTag({name:"",id:undefined})}
              className="p-2 flex items-center justify-center bg-primary-0 text-white rounded-lg shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <X className="w-4 h-4"/>
            </motion.button>
          )}
        </div>
        
        <div className="flex gap-4">
          <motion.div 
            className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2 transition-all hover:bg-opacity-20"
            whileHover={{ scale: 1.02 }}
          >
            <Search className="text-white/70" />
            <input 
              type="text" 
              placeholder="Search projects..."
              className="bg-transparent focus:outline-none outline-none text-white placeholder-white/50 ml-2 w-32 md:w-auto"
              onChange={(e) => setSearch(e.target.value.trim())} 
            />
          </motion.div>
          
          <motion.button
            className="flex items-center gap-2 bg-white bg-opacity-10 rounded-lg px-4 py-2 transition-all hover:bg-opacity-20"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            whileHover={{ scale: 1.02 }}
          >
            <SlidersHorizontalIcon className="text-white/70" />
            <p className="text-white">Filter</p>
          </motion.button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        layout
      >
        {Array.isArray(projects) && projects.length > 0 && 
          projects
            .filter((project) => (project.fields.title as string).toLowerCase().includes(search.toLowerCase()))
            .map((post, index) => (
              <motion.div
                key={post.sys.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                layout
              >
                <ProjectCard 
                  name={post.fields.title as string} 
                  description={post.fields.description as string} 
                  to={`/blog/${post.sys.id}`}
                />
              </motion.div>
            ))
        }
      </motion.div>

      {/* Pagination */}
      <motion.div 
        className="flex justify-center items-center gap-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button className="px-4 py-2 text-white/70 hover:text-white transition-colors">
          Prev
        </button>
        
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <motion.button
              key={num}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                num === 1 
                  ? 'bg-primary-0 text-white' 
                  : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {num}
            </motion.button>
          ))}
        </div>
        
        <button className="px-4 py-2 text-white/70 hover:text-white transition-colors">
          Next
        </button>
      </motion.div>
    </div>
  )
}
const ProjectCard = ({  name, description, to }: {  name: string, description: string, to:string }) => {
    return (
         <motion.div 
      className="relative w-full h-[400px] md:h-[450px] rounded-xl overflow-hidden group border-2 border-neutral-700 hover:border-primary-0 transition-all duration-300"
      whileHover={{ scale: 1.03 }}
    >
      <div className="absolute inset-0 bg-neutral-900">
        <Image 
          src="/images/WDS LOGO WHITE.png" 
          alt={name + " image"} 
          fill
          className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-3 lg:p-6">
        <motion.div 
          className="flex flex-col h-full lg:h-[40%] group-hover:h-full transition-all duration-500 bg-primary-0 bg-opacity-10 lg:backdrop-blur-0 backdrop-blur-sm lg:bg-opacity-0 group-hover:bg-opacity-10 group-hover:backdrop-blur-sm p-4 rounded-lg"
          initial={{ y: 50 }}
          whileHover={{ y: 0 }}
        >
          <div className="mb-4">
            <motion.h3 
              className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:line-clamp-none"
              layout
            >
              {name}
            </motion.h3>
            
            <motion.p 
              className="text-white/70 text-sm line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
              layout
            >
              {description}
            </motion.p>
          </div>
          
          <motion.button
            className="w-full py-3 mt-[100px] lg:mt-auto bg-transparent border-2 border-white rounded-lg font-medium text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={to} className="block" prefetch>
              Open Article
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
    )
}

export default Projects