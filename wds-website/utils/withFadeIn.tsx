"use client";
import { AnimatePresence,motion } from "framer-motion";
const fadeInOutVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
import { ComponentType } from "react";

export const withFadeIn = <P extends object>(Component: ComponentType<P>) => {
  return function WrappedComponent(props: P) {
    return (
      <AnimatePresence mode="wait">
        <motion.section
          key="main-section"
          className="w-full min-h-screen flex flex-col px-2 md:px-[80px]"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeInOutVariants}
          transition={{ duration: 0.5 }}
        >
          <Component {...props} />
        </motion.section>
      </AnimatePresence>
    );
  };
};
