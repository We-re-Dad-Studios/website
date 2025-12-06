"use client";

import { motion, AnimatePresence } from "framer-motion";

import { CFBlogPost, CFTag } from "@/lib/contentful";
import BlogList from "./Bloglist";

export const Home = ({ initialPosts, initialTags }:{initialPosts:CFBlogPost[],initialTags:CFTag[]}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="blog-home"
        className="w-full min-h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BlogList posts={initialPosts} tags={initialTags} />
      </motion.section>
    </AnimatePresence>
  );
};
