"use client";
import React from 'react'
import Projects from './Projects'
import {motion} from "framer-motion"
export const ProjectPageinator = () => {
  return (
    <div className='flex flex-col items-center w-full px-4 md:px-8t lg:px-16'>
      <motion.h1 
        className="font-bebas text-3xl md:text-5xl py-8 md:py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        BROWSE OUR <span className="text-primary-0">CURATED</span> COLLECTIONS
      </motion.h1>
     <Projects/>
    </div>
  )
}

