"use client";

import { createElement } from "react";
import { motion } from "framer-motion";

type AnimatedArrowProps = {
  className?: string;
};

const strokeTransition = {
  duration: 1.2,
  ease: "easeInOut" as const,
  repeat: Infinity,
  repeatType: "reverse" as const,
};

export const AnimatedArrow = ({ className = "" }: AnimatedArrowProps) => {
  return createElement(
    "span",
    {
      "aria-hidden": true,
      className: `inline-flex items-center ${className}`.trim(),
    },
    createElement(
      motion.svg,
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 18 14",
        fill: "none",
        className: "h-[14px] w-[18px]",
        animate: { x: [0, 4, 0] },
        transition: { duration: 1.4, ease: "easeInOut", repeat: Infinity },
      },
      createElement(motion.path, {
        d: "M1 7h16",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        initial: { pathLength: 0.2, opacity: 0.5 },
        animate: { pathLength: 1, opacity: 1 },
        transition: strokeTransition,
      }),
      createElement(motion.path, {
        d: "M11 1l6 6-6 6",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        initial: { pathLength: 0.2, opacity: 0.5 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { ...strokeTransition, delay: 0.1 },
      })
    )
  );
};
