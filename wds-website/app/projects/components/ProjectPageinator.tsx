"use client";

import React from "react";
import { motion } from "framer-motion";
import Projects from "./Projects";
import { Entry, EntrySkeletonType } from "contentful";

interface ProjectPageinatorProps {
  initialProjects: Entry<EntrySkeletonType, undefined, string>[];
  tags: Entry<EntrySkeletonType, undefined, string>[];
}

export const ProjectPageinator: React.FC<ProjectPageinatorProps> = ({
  initialProjects,
  tags,
}) => {
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-16">
      <motion.h1
        className="font-bebas text-3xl md:text-5xl py-8 md:py-12 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        BROWSE OUR <span className="text-primary-0">CURATED</span> COLLECTIONS
      </motion.h1>

      <Projects initialProjects={initialProjects} tags={tags} />
    </div>
  );
};
