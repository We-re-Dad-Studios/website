import React from "react";
import projects from "@/cached/newProjects.json";
import Image from "next/image";
import Link from "next/link";
export const ProjectsSection = () => {
  // const data: TMockData = useFetchMockData(50, 1, 'manga')

  // if (!data.loading) console.log(data);

  return (
     <section className="py-20 flex flex-col items-center px-6 bg-neutral_1000">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">YOUR JOURNEY BEGINS HERE!</h1>
        <div className="w-24 h-1 bg-primary-0 mx-auto mb-8"></div>
        <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
          Discover a world filled with thoughtfully curated projects, ranging from
          thrilling games and captivating novels, manga, manhwa, and animations.
        </p>
      </div>
      
      <div className="mt-16 w-full container mx-auto">
        <div className="relative">
          {/* Gradient fade effect on sides */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral_1000 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral_1000 to-transparent z-10"></div>
          
          <div className=" overflow-x-auto py-4">
            <div className="flex flex-row gap-6">
              {projects.map((project) => (
                <ProjectCard
                  to={project.to ? project.to : "/"}
                  key={project.name}
                  {...project}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ProjectCard = ({
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
     <div className="relative md:w-full w-[340px] min-w-[320px] max-w-screen md:max-w-max col-span-1  h-[420px] md:h-[480px] rounded-xl border-2 border-neutral-700 overflow-hidden group transition-all duration-300 hover:border-primary-0 hover:scale-[1.02]">
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
        <div className="transform  translate-y-4 md:translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl md:text-3xl font-bold text-white">{name}</h3>
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
            className="mt-3 w-full py-2 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-neutral_1000 transition-all duration-300 text-center block text-white"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>

  );
};
