"use client";
import { AnimatedArrow } from "@/components/AnimatedArrow";
import { SplashImage } from "@/components/SplashImage";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {motion} from "framer-motion"
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/ProjectsSection";

export default function Home() {
  const {getItem,storeItem} = useSessionStorage();
  const router = useRouter();
  const [hasVisited,setHasvisited]=useState<boolean>(()=>{
    const state = getItem("state");
    if(!state){
      return false
    }
    else{
      const {hasVisited} = JSON.parse(state);
      return hasVisited as boolean;
    }
  })
  const handleVisited=()=>{
    storeItem("state",JSON.stringify({hasVisited:true}));
    setHasvisited(true);
  }
  const fadeInOutVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  return (
    <AnimatePresence mode="wait" >
      {!hasVisited ? (
        <motion.section
          key="welcome-section"
          className="w-full min-h-screen flex justify-center items-center flex-col"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeInOutVariants}
          transition={{ duration: 0.5 }} // Control the animation speed
        >
          {/* Your first section content */}
          <SplashImage />
          <button
            onClick={handleVisited}
            className={
              "mt-4 transition-all duration-300 z-[20] flex flex-row items-center py-2 px-10 max-w-full welcome-btn main-btn " +
           ""
            }
          >
            Begin Your Journey <AnimatedArrow />
          </button>
        </motion.section>
      ) : (
        <motion.section
          key="main-section"
          className="w-full min-h-screen flex flex-col"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeInOutVariants}
          transition={{ duration: 0.5 }} // Control the animation speed
        >
       <Navbar/>
       <div className="w-full h-[90vh] bg-neutral_1000 grid place-items-center">
          <h1 className="text-[60px]">Coming Soon</h1>
       </div>
       <ProjectsSection/>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

