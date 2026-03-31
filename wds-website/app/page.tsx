"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedArrow } from "@/components/AnimatedArrow";
import { SplashImage } from "@/components/SplashImage";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { HeroSection } from "@/components/Hero-section";

const fadeInOutVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Home() {
  const { storeItem, getItem } = useSessionStorage();
  const router = useRouter();
  const [hasVisited, setHasVisited] = useState<boolean>(false);
  const [splashImageLoaded, setSplashImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const state = getItem("state");
    if (state) {
      try {
        const parsed = JSON.parse(state);
        if (parsed?.hasVisited) {
          setHasVisited(true);
        }
      } catch {
        // ignore malformed state
      }
    }
  }, [getItem]);

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
          <SplashImage onImageLoaded={() => setSplashImageLoaded(true)} />
          <motion.button
            onClick={handleVisited}
            className="mt-8 transition-all duration-300 z-[20] flex flex-row items-center gap-2 py-3 px-12 welcome-btn main-btn hover:gap-4 hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: splashImageLoaded ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Begin Your Journey <AnimatedArrow />
          </motion.button>
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
          <HeroSection />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
