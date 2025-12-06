"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const TransitionOverlay = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    show && (
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="
          fixed inset-0 z-[9999]
          bg-black/90 backdrop-blur-xl
          border-t-4 border-primary-0
          shadow-[0_0_40px_rgba(249,76,16,0.4)]
        "
      />
    )
  );
};
