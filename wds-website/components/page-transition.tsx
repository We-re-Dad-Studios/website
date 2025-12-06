"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EchoParticles } from "./echo-particles";

export const EchoTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {animating && (
          <>
            {/* Slight magical dim */}
                <motion.div
              key="dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                fixed inset-0 bg-black/70 
                backdrop-blur-sm 
                z-[99998]
              "
            />

            {/* Echo particles */}
            <EchoParticles />
          </>
        )}
      </AnimatePresence>

      {/* Page fade for smoothness */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
};
