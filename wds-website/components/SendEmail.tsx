"use client";

import React, {  useEffect, useMemo, useRef, useState } from "react";
import {motion} from "framer-motion"
import { ChevronDown } from "lucide-react";

type category ="All Categories"|"Games"|"Novels"|"Visual Projects"
export const SendEmail = () => {
    const [category,setCategory]=useState<category>("All Categories");
  return (
    <div className="flex flex-col gap-y-3 w-full">
        <div className="w-[80%] mx-auto rounded-lg relative bg-white p-2 flex items-center">
        <input type="text" className="bg-transparent flex-1 h-full  p-1 outline-none focus-within:outline-none focus:outline-none text-black" placeholder="Enter your email address" />
        <Dropdown chosenCategory={category} setCategory={setCategory}/>
    </div>
    <button className="w-60 max-w-[80%] mx-auto rounded-lg bg-primary-0 py-2 px-6 text-white">Submit</button>
    </div>
  )
}

const Dropdown=({chosenCategory,setCategory}:{chosenCategory:category,setCategory:React.Dispatch<React.SetStateAction<category>>})=>{
  
    const [isDropdownOpen,setIsDropdownOpen]=useState<boolean>(false);
    const [isClient,setIsClient]=useState(false);
    const dropdownButtonRef= useRef<HTMLButtonElement|undefined>();
    const containerRef = useRef<HTMLDivElement|undefined>();
    const dropdownVariants =useMemo(()=>{if(dropdownButtonRef.current){
        return{
            default:{top:isClient? dropdownButtonRef.current.getBoundingClientRect().top||0 -20: -20,zIndex:-1,opacity:0},
            open:{top:isClient? (dropdownButtonRef.current.getBoundingClientRect().top+(dropdownButtonRef.current?.clientHeight ?dropdownButtonRef.current?.clientHeight:0)+10 ):"110%",zIndex:999,opacity:100},
            closed:{top:isClient?dropdownButtonRef.current?.getBoundingClientRect().top||0 -20: -20,zIndex:-1,opacity:0}
        }

    }
    else{
        return{
            default:{top:0,zIndex:-1,opacity:0},
            open:{top:0,zIndex:999,opacity:100},
            closed:{top:0,zIndex:-1,opacity:0}
        }
    }


},[isClient,dropdownButtonRef.current])
    useEffect(()=>{
        if(!isClient){
            setIsClient(true);
        }
        if(isClient){
            
            document.addEventListener("click",(e)=>{
                if(!containerRef.current?.contains(e.target as Node) && !dropdownButtonRef.current?.contains(e.target as Node)){
                    setIsDropdownOpen(false);
                }
            });
        }
    },[isClient])
    return(
       <div className="relative">
        <button ref={(el:HTMLButtonElement)=>{dropdownButtonRef.current=el}} className="hover:bg-primary-0 h-full px-3 py-1.5 rounded text-black flex items-center justify-center gap-x-1.5 hover:text-white transition-colors" onClick={(e)=>{
            e.stopPropagation();
            e.preventDefault();
            setIsDropdownOpen((state)=>!state)}}>{chosenCategory} <ChevronDown/></button>
       
<motion.div animate={isDropdownOpen?"open":"closed"} initial={"default"} className="w-40 h-max py-2 fixed bg-primary-0 rounded-lg px-1.5" variants={dropdownVariants}>

<div ref={(el:HTMLDivElement)=>{containerRef.current=el}} className="flex flex-col " >
    <button onClick={()=>{setCategory("All Categories");}} className="hover:bg-slate-100/10">All categories</button>
    <button onClick={()=>{setCategory("Games");}} className="hover:bg-slate-100/10">Games</button>
    <button onClick={()=>{setCategory("Novels");}} className="hover:bg-slate-100/10">Novels</button>
    <button onClick={()=>{setCategory("Visual Projects");}} className="hover:bg-slate-100/10">Visual Projects</button>
</div>
</motion.div>
</div>
    )
}