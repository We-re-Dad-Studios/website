"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap } from "lucide-react";

const projects = [
  {
    slug: "dawnshipper",
    title: "Dawnshipper",
    tagline: "He bonded with the Echo of Chaos. Now everyone wants him dead.",
    genre: "Dark Epic Fantasy",
    image: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg",
    color: "from-purple-600 to-primary-0",
    accentColor: "text-purple-400",
    chaptersLink: "/novels/dawnshipper/chapters/echoes-and-embers",
    projectLink: "/projects/dawnshipper",
    icon: BookOpen,
  },
  {
    slug: "project_osiris",
    title: "Project Osiris",
    tagline: "Death is negotiable—for a price.",
    genre: "Sci-Fi Thriller",
    image: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg",
    color: "from-cyan-600 to-blue-600",
    accentColor: "text-cyan-400",
    chaptersLink: "/novels/project_osiris/chapters/chapter-1",
    projectLink: "/projects/project_osiris",
    icon: Zap,
  },
];

interface OtherProjectsCTAProps {
  currentProject?: string; // Exclude this project from the list
  showNewsletter?: boolean;
}

export function OtherProjectsCTA({ 
  currentProject,
  showNewsletter = true 
}: OtherProjectsCTAProps) {
  const filteredProjects = projects.filter(p => p.slug !== currentProject);

  if (filteredProjects.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            More Stories to Explore
          </h2>
          <p className="text-white/60 max-w-lg mx-auto">
            Dive into our other ongoing series
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-30`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8 min-h-[280px] flex flex-col justify-end">
                {/* Genre badge */}
                <div className="flex items-center gap-2 mb-3">
                  <project.icon className={`w-4 h-4 ${project.accentColor}`} />
                  <span className={`text-sm font-medium ${project.accentColor}`}>
                    {project.genre}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-primary-0 transition-colors">
                  {project.title}
                </h3>

                {/* Tagline */}
                <p className="text-white/70 mb-6 line-clamp-2">
                  {project.tagline}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={project.chaptersLink}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-primary-0 hover:bg-primary-0/90 text-white font-semibold rounded-xl transition-all hover:scale-[1.02]"
                  >
                    Start Reading
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={project.projectLink}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/10"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA below projects */}
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
              <span className="text-white/70">Want updates on all our stories?</span>
              <Link 
                href="#newsletter" 
                className="text-primary-0 font-semibold hover:underline"
              >
                Subscribe to the newsletter →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Compact version for sidebars
export function OtherProjectsCompact({ currentProject }: { currentProject?: string }) {
  const filteredProjects = projects.filter(p => p.slug !== currentProject);

  if (filteredProjects.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
        Also Reading
      </h4>
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Link
            key={project.slug}
            href={project.projectLink}
            className="group flex items-center gap-4 p-3 -m-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${project.accentColor} mb-1`}>
                {project.genre}
              </p>
              <h5 className="font-semibold text-white group-hover:text-primary-0 transition-colors">
                {project.title}
              </h5>
              <p className="text-xs text-white/50 mt-1 line-clamp-1">
                {project.tagline}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary-0 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}