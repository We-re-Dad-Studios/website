"use client";
import { AnimatePresence,motion } from "framer-motion";
import { ProjectPageinator } from "./ProjectPaginator";




export const Home = () => {
    const fadeInOutVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      };
  return (
    <AnimatePresence mode="wait" >
    <motion.section
      key="main-section"
      className="w-full min-h-screen flex flex-col  "
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInOutVariants}
      transition={{ duration: 0.5 }} // Control the animation speed
    >
        

   <div className="w-full h-[40vh] bg-neutral_1000 grid place-items-center overflow-hidden">
      <div className="text-[60px] brightness-50">
        <video src="video/jumbotronSite.mp4" autoPlay loop className="w-[100vw]"></video>
      </div>
   </div>
   <ProjectPageinator/>
 
    </motion.section>
</AnimatePresence>
  )
}
