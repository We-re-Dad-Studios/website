"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { AnimatedArrow } from "@/components/AnimatedArrow";
import { SplashImage } from "@/components/SplashImage";
import { ProjectsSection } from "@/components/ProjectsSection";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import Image from "next/image";

const fadeInOutVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Home() {
  const { storeItem } = useSessionStorage();
  const router = useRouter();
  const [hasVisited, setHasVisited] = useState<boolean>(false);

  useEffect(() => {
    const state = sessionStorage.getItem("state");
    if (state) {
      try {
        const parsed = JSON.parse(state);
        if (parsed?.hasVisited) {
          setHasVisited(true);
        }
      } catch (e) {
        console.error("Failed to parse session storage state:", e);
      }
    }
  }, []);

  const handleVisited = () => {
    storeItem("state", JSON.stringify({ hasVisited: true }));
    setHasVisited(true);
    router.refresh();
  };

  return (
    <AnimatePresence mode="wait">
      {!hasVisited ? (
        <motion.section
          key="welcome-section"
          className="w-full min-h-screen flex justify-center items-center flex-col relative"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeInOutVariants}
          transition={{ duration: 0.5 }}
        >
          <SplashImage />
          <button
            onClick={handleVisited}
            className="mt-8 transition-all duration-300 z-[20] flex flex-row items-center gap-2 py-3 px-12 welcome-btn main-btn hover:gap-4 hover:scale-105"
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
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-[95vh] bg-neutral_1000 grid place-items-center relative overflow-hidden">
            <Image className="w-full h-full  object-cover " height={1200} width={1900} alt="WDS cover image" src={"https://downloads.ctfassets.net/3gg0xih7foqh/3rxvtQJQc3xmwVWRZzm5fS/c773572af2f7a1a49a886aa04135c5ef/Final_Withlogo.jpg"}/>
            <div className="absolute left-1/2 top-1/2 w-max h-max  -translate-y-1/2 flex flex-col items-center justify-center gap-4">
              <Image src={"/images/WDS LOGO WHITE.png"} className=" w-80 aspect-square -translate-x-1/2 opacity-60" alt="wds logo" draggable={false} width={200} height={200}/>
            </div>
          
          </div>
          <ProjectsSection />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
