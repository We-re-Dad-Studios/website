"use client";
import { AnimatedArrow } from "@/components/AnimatedArrow";
import { SplashImage } from "@/components/SplashImage";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { AnimatePresence,motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
export default function Home() {
  const {storeItem} = useSessionStorage();
  const [hasPageMounted,setHasPageMounted]=useState<boolean>(false);
  const [hasVisited,setHasvisited]=useState<boolean>(()=>{
    const state =hasPageMounted?sessionStorage.getItem("state"):null;
    if(!state){
      return false
    }
    else{
      const {hasVisited} = JSON.parse(state);
      return hasVisited as boolean;
    }
  })
  useEffect(()=>{
    if(!hasPageMounted){
      setHasPageMounted(true);
    }
    else{
      setHasvisited(()=>{
        const state =hasPageMounted?sessionStorage.getItem("state"):null;
        if(!state){
          return false
        }
        else{
          const {hasVisited} = JSON.parse(state);
          return hasVisited as boolean;
        }
      })
    }
  },[hasPageMounted])
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
          className="w-full min-h-screen flex flex-col  "
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
       <Newsletter/>
       <Footer/>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

