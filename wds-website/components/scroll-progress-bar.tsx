"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { MotionValue } from "framer-motion";

interface ScrollContextType {
  progress: MotionValue<number> | null;
  setProgress: (mv: MotionValue<number>) => void;
}

export const ScrollContext = createContext<ScrollContextType>({
  progress: null,
  setProgress: () => {},
});

export const useScrollProgress = () => useContext(ScrollContext);
export default function ScrollProgressBar() {
const { progress: scrollYProgress } = useScrollProgress();
// console.log("ScrollYProgress:", scrollYProgress);
  const pathName = usePathname();
  if(!pathName.includes("/novels/")) {
    return null;
  }

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress?scrollYProgress:0,    // smooth and perfect
        transformOrigin: "0%",
      }}
      className="fixed top-[80px] left-0 right-0 h-1 bg-primary-0 z-[999]"
    />
  );
}


export const ScrollProgressBarProvider = ({
  children,
}: {
  children: React.ReactNode;
})=>{
    const [scrollProgress,setScrollProgress] = useState<MotionValue<number>|null>(null);
    return (
        <ScrollContext.Provider value={{progress:scrollProgress,setProgress:setScrollProgress}}>
            {children}
        </ScrollContext.Provider>
    )
}