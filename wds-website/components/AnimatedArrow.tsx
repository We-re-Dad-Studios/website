import React from 'react'
import {motion} from "framer-motion"
export const AnimatedArrow = () => {
  return (
    <div className='relative'>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"  // Set stroke to white
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-big-right h-10 w-10 relative ml-2 mt-[calc(25%)]"
        initial={{ strokeDashoffset: 100, strokeDasharray: 100 }}  // Start fully hidden
        animate={{ strokeDashoffset: 0 }}  // Animate to fully visible
        transition={{
          duration: 2,  // Duration of 2 seconds for the fill animation
          ease: "easeInOut",
          repeat: Infinity,
        }}
        width="18" height="14" id="arrow"
      >
        <g fill="none" fillRule="evenodd" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M1 7h16M11 1l6 6-6 6"></path>
        </g>
      </motion.svg>
    </div>
  )
}
<svg >
 
</svg>

