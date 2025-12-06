"use client";
export interface BlogListProps {
  posts: CFBlogPost[];
  tags: CFTag[];
}

export interface BlogFilterState {
  selectedTag: string | null;
  search: string;
}

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CFBlogPost, CFTag } from "@/lib/contentful";

const BlogList = ({ posts, tags }:BlogListProps) => {
  const [selectedTag, setSelectedTag] = useState<string|null>(null);
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const title = post.fields.title?.toLowerCase() || "";
      const desc = post.fields.description?.toLowerCase() || "";

      const matchesSearch =
        search.trim() === "" ||
        title.includes(search.toLowerCase()) ||
        desc.includes(search.toLowerCase());

      const matchesTag =
        !selectedTag ||
        (post.fields.tags || []).some((t) => t.sys.id === selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, search, selectedTag]);

  return (
    <div className="w-full px-6 lg:px-16 py-12 container mx-auto">

      {/* TAG FILTER */}
      <div className="flex gap-3 flex-wrap mb-10">
        {tags.filter(tag=>tag.fields.name).map((tag) => (
          <button
            key={tag.sys.id}
            onClick={() =>
              setSelectedTag(
                selectedTag === tag.sys.id ? null : tag.sys.id
              )
            }
            className={`
              px-4 py-2 rounded-lg text-sm transition
              ${
                selectedTag === tag.sys.id
                  ? "bg-primary-0 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
          >
            {tag.fields.name}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="mb-10">
        <input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full bg-white/10 border border-white/20 rounded-lg p-3
            text-white placeholder-white/50
            focus:outline-none focus:border-primary-0
          "
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post, i) => (
          <motion.div
            key={post.sys.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl overflow-hidden border border-white/10 hover:border-primary-0 transition"
          >
            <Link href={`/blog/${post.sys.id}`}>
              <div className="relative h-[220px] bg-black">
                <Image
                  src="/images/WDS LOGO WHITE.png"
                  alt={post.fields.title}
                  fill
                  className="object-contain opacity-60"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl text-white mb-2 line-clamp-2">
                  {post.fields.title}
                </h3>
                <p className="text-white/60 text-sm line-clamp-3">
                  {post.fields.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-neutral-500 mt-20">
          No posts match your filters.
        </p>
      )}
    </div>
  );
};

export default BlogList;
