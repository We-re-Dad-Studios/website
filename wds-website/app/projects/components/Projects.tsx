"use client";

import { Search, SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Entry, EntrySkeletonType } from "contentful";
import Link from "next/link";
import Image from "next/image";

interface ProjectsProps {
  initialProjects: Entry<EntrySkeletonType, undefined, string>[];
  tags: Entry<EntrySkeletonType, undefined, string>[];
}

const Projects: React.FC<ProjectsProps> = ({ initialProjects, tags }) => {
  // console.log({initialProjects,tags})
  const [currentTagId, setCurrentTagId] = useState<string | null>(null);
  const [currentTagName, setCurrentTagName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(
    () =>initialProjects?
      initialProjects.filter((project) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = project.fields as any;
        const name = (fields.name as string) ?? "";
        const description = (fields.description as string) ?? "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const projectTags = (fields.tags as any[]) ?? [];

        const matchesTag = currentTagId
          ? projectTags.some((t) => t?.sys?.id === currentTagId)
          : true;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = q
          ? name.toLowerCase().includes(q) ||
            description.toLowerCase().includes(q)
          : true;

        return matchesTag && matchesSearch;
      }):[],
    [initialProjects, currentTagId, searchQuery]
  );

  return (
    <div className="w-full container mx-auto">
      {/* TAGS + SEARCH */}
      <div className="flex w-full justify-between pb-10">
        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tags)&&tags.map((tag) => {
              const name = tag.fields.name as unknown as string;
              const isActive = tag.sys.id === currentTagId;

              return (
                <button
                  key={tag.sys.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-0 text-black shadow-md"
                      : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                  onClick={() => {
                    if (isActive) {
                      setCurrentTagId(null);
                      setCurrentTagName(null);
                    } else {
                      setCurrentTagId(tag.sys.id);
                      setCurrentTagName(name);
                    }
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* Search / Filter */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-primary-0 transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent outline-none text-sm w-full placeholder-gray-400 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 text-sm transition-all text-gray-200">
              <SlidersHorizontalIcon className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRID / EMPTY STATE */}
      {filteredProjects.length === 0 ? (
        <div className="w-full py-16 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-center">
          <p className="text-neutral_300 text-lg font-medium">
            No projects match your filters.
          </p>
          <p className="text-neutral_500 text-sm mt-1">
            Try clearing your search or selecting a different tag.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5 gap-6">
          {filteredProjects.map((project) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fields = project.fields as any;

            const to = fields.useInternalRoute
              ? (fields.to as string)
              : `/project/${project.sys.id}`;

            return (
              <ProjectCard
                key={project.sys.id}
                to={to}
                image={fields.image ?? null}
                name={fields.name as string}
                description={fields.description as string}
                type={currentTagName ?? ""}
              />
            );
          })}
        </div>
      )}

      {/* Pagination placeholder (still static) */}
      <div className="flex gap-5 items-center text-xs cursor-pointer py-10 text-gray-400">
        <div className="text-gray-600">Prev</div>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="px-4 py-2 bg-white/10 rounded-md border border-gray-700 hover:bg-primary-0 hover:text-black transition-all"
            >
              {num}
            </div>
          ))}
        </div>
        <div>Next</div>
      </div>
    </div>
  );
};

const ProjectCard = ({
  image,
  name,
  description,
  type,
  to,
}: {
  image: string | null;
  name: string;
  description: string;
  type: string;
  to: string;
}) => {
  return (
    <div className="relative col-span-1 h-[420px] md:h-[480px] rounded-xl border-2 border-neutral-700 overflow-hidden group transition-all duration-300 hover:border-primary-0 hover:scale-[1.02]">
      {/* Image Background */}
      <div className="absolute inset-0 bg-neutral_900">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-300"
          />
        ) : (
          <div className="grid place-items-center h-full">
            <p className="text-3xl font-agdasima text-white/30">
              Coming Soon
            </p>
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/30 to-transparent">
        <div className="transform translate-y-4 md:translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {name}
            </h3>
            {type && (
              <span className="text-xs px-2 py-1 bg-primary-0 rounded-full text-white uppercase tracking-wider">
                {type}
              </span>
            )}
          </div>

          <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3 group-hover:line-clamp-5 transition-all duration-300 mb-4">
            {description}
          </p>

          <Link
            href={to}
            prefetch={true}
            className="mt-3 w-full py-2 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-neutral_1000 transition-all duration-300 text-center block text-white"
          >
            Check it out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
