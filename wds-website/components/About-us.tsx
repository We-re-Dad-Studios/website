"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  {
    id: 1,
    name: "Frankln",
    role: "Co-founder,Lead",
    tagline: "World Builder",
    bio: "Visionary storyteller with 10+ years of experience crafting immersive worlds across games, novels, and animation.",
    image: "/images/grandfather.png",
    color: "#8800CC",
    gradient: "from-purple-600 to-indigo-900",
    stats: { specialty: "Gameplay Mechanics" },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 2,
    name: "Ehiosu",
    role: "Co-founder,Lead",
    tagline: "The 'what if we try...' guy.",
    bio: `I'm the "what if we try…" guy,the one jumping between stories, games, and animations to make sure every idea hits its spark. If I'm not the one who started it, I'm definitely the one poking it until it shines.`,
    image: "/images/ehi-2.png",
    color: "#F94C10",
    gradient: "from-orange-600 to-red-900",
    stats: { specialty: "Gameplay Mechanics" },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 3,
    name: "Praise",
    role: "Co-founder",
    tagline: "Visual Storyteller",
    bio: "Master of visual storytelling, creating stunning artwork that brings characters and worlds to life.",
    image: "/images/bamiyo.png",
    color: "#1897F2",
    gradient: "from-pink-600 to-purple-900",
    stats: { specialty: "Ego" },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 4,
    name: "Adams",
    role: "Co-founder",
    tagline: "Idea validator",
    bio: "Crafting compelling narratives that resonate with audiences across all mediums.",
    image: "/images/smada.png",
    color: "#18F24B",
    gradient: "from-violet-600 to-purple-900",
    stats: { specialty: "Systems" },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 5,
    name: "El' Agbon",
    role: "Creative Lead",
    tagline: "The Sandman",
    bio: " I am where ideas come to die, decay and then reanimate to walk the realms of men, undead and eternal. I am what happens when nightmares clash with daydreams for the mind of the dreamer. I am a blackhole drawing you into nothingness, daring you to leap into the unknown. For where else will you find life's greatest wonders? I am destiny's squire. I am your path to worlds you thought you knew. I am the end of the beginning. Fear me, for this path I shepherd you on, leads to madness.",
    image: "/images/el.png",
    color: "#F2181C",
    gradient: "from-indigo-600 to-purple-900",
    stats: { specialty: "Builder and Destroyer of worlds." },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 6,
    name: "Tired Gremlin",
    role: "Writing Lead",
    tagline: "Story Alchemist",
    bio: "Visionary storyteller with 7+ years of experience building immersive worlds across short stories, novels and animation.",
    image: "/images/tg.png",
    color: "#caffbf",
    gradient: "from-indigo-600 to-purple-900",
    stats: { specialty: "Creative Writing" },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 7,
    name: "Juwon",
    role: "Artist",
    tagline: "Painter of impossible worlds.",
    bio: "a concept, comic book and character illustrator with 7+ years of experience in concept art, character designs and comic book illustrations. ",
    image: "/images/WDS LOGO WHITE.png",
    color: "#f7b801",
    gradient: "from-indigo-600 to-purple-900",
    stats: { specialty: "Character Art" },
    social: { twitter: "#", instagram: "#", linkedin: "#" },
  },
];

// A member without a real headshot falls back to the logo path; treat that as
// "no photo yet" and render a branded initial instead of a cropped logo.
const hasPhoto = (image: string) => !image.includes("WDS LOGO");

// Deterministic positions — computed once at module load, never change on re-render.
// Avoids Math.random() in render (causes position churn + hydration mismatch).
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: ((i * 73 + 17) % 97).toFixed(1),
  top: ((i * 53 + 11) % 91).toFixed(1),
  duration: 2 + (i % 3),
  delay: +((i * 0.37) % 2).toFixed(2),
}));

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setSelectedMember((prev) => (prev + 1) % teamMembers.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const handleMemberSelect = (index: number) => {
    setSelectedMember(index);
    setIsAutoCycling(false);
    setTimeout(() => setIsAutoCycling(true), 15000);
  };

  const currentMember = teamMembers[selectedMember];

  return (
    <>
      {/* Animated Background — fixed positioning covers the whole page.
          CSS-driven animations (compositor thread, not main thread). */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `particle-pulse ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Team Section */}
      <section id="team" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                SELECT
              </span>{" "}
              <span className="text-white">CHARACTER</span>
            </h2>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Main Display */}
          <div className="mb-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMember}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <div
                  className={`absolute -inset-4 bg-gradient-to-r ${currentMember.gradient} opacity-20 blur-3xl rounded-3xl`}
                />

                <div
                  className="relative bg-black/60 backdrop-blur-xl border-4 rounded-3xl overflow-hidden"
                  style={{ borderColor: currentMember.color }}
                >
                  <div className="grid lg:grid-cols-2 gap-8 p-8">
                    {/* Character Visual */}
                    <div className="relative">
                      {/* CSS box-shadow transition instead of framer-motion infinite loop */}
                      <div
                        className="relative aspect-square md:w-full w-[70%] mx-auto rounded-2xl overflow-hidden"
                        style={{
                          boxShadow: `0 0 80px ${currentMember.color}80`,
                          transition: "box-shadow 0.5s ease",
                        }}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${currentMember.gradient} opacity-30`}
                        />
                        <div className="relative w-full h-full rounded overflow-hidden">
                          {hasPhoto(currentMember.image) ? (
                            <Image
                              src={currentMember.image}
                              alt={currentMember.name}
                              fill
                              sizes="(max-width: 768px) 70vw, 50vw"
                              priority
                              className="relative w-full h-full object-contain object-top drop-shadow-2xl"
                            />
                          ) : (
                            <div
                              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${currentMember.gradient}`}
                            >
                              <span className="text-7xl md:text-8xl font-bold text-white/90">
                                {currentMember.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Corner Decorations */}
                        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                          <div
                            key={pos}
                            className={`absolute w-8 h-8 border-2 ${
                              pos.includes("top") ? "top-4" : "bottom-4"
                            } ${pos.includes("left") ? "left-4" : "right-4"} ${
                              pos.includes("top") && pos.includes("left")
                                ? "border-r-0 border-b-0"
                                : pos.includes("top") && pos.includes("right")
                                ? "border-l-0 border-b-0"
                                : pos.includes("bottom") && pos.includes("left")
                                ? "border-r-0 border-t-0"
                                : "border-l-0 border-t-0"
                            }`}
                            style={{ borderColor: currentMember.color }}
                          />
                        ))}
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {Object.entries(currentMember.stats).map(([key, value]) => (
                          <motion.div
                            key={key}
                            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center"
                            whileHover={{ scale: 1.05, borderColor: currentMember.color }}
                          >
                            <div
                              className="text-lg lg:text-2xl font-bold"
                              style={{ color: currentMember.color }}
                            >
                              {value}
                            </div>
                            <div className="text-xs text-gray-400 capitalize">{key}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Character Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-6"
                        >
                          <div
                            className="text-sm font-bold mb-2"
                            style={{ color: currentMember.color }}
                          >
                            {currentMember.tagline.toUpperCase()}
                          </div>
                          <h3 className="text-2xl lg:text-5xl font-bold mb-2">
                            {currentMember.name}
                          </h3>
                          <div className="text-[18px] lg:text-2xl text-gray-400 mb-4">
                            {currentMember.role}
                          </div>
                          <div
                            className="h-1 w-24 rounded-full mb-6"
                            style={{ backgroundColor: currentMember.color }}
                          />
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg text-gray-300 leading-relaxed mb-8"
                        >
                          {currentMember.bio}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Character Select Grid */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 blur-3xl" />
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">ROSTER</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isAutoCycling ? "bg-green-500" : "bg-gray-500"
                    } animate-pulse`}
                  />
                  <span className="text-sm text-gray-400">
                    {isAutoCycling ? "Auto-Cycling" : "Manual"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {teamMembers.map((member, index) => (
                  <motion.button
                    key={member.id}
                    onClick={() => handleMemberSelect(index)}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all"
                      style={{
                        borderColor:
                          selectedMember === index
                            ? member.color
                            : "rgba(255,255,255,0.1)",
                        boxShadow:
                          selectedMember === index
                            ? `0 0 30px ${member.color}80`
                            : "none",
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                      }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-40`}
                      />
                      {hasPhoto(member.image) ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          className="relative w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${member.gradient}`}
                        >
                          <span className="text-3xl font-bold text-white/90">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {selectedMember === index && (
                        <div
                          className="absolute inset-0 border-2"
                          style={{
                            borderColor: member.color,
                            animation: "roster-selected-pulse 2s ease-in-out infinite",
                          }}
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="w-full">
                          <div className="text-xs font-bold truncate">{member.name}</div>
                          <div className="text-xs text-gray-400 truncate">{member.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Name Label */}
                    <div className="mt-2 text-center">
                      <div className="text-sm font-bold truncate">{member.name}</div>
                      <div className="text-xs" style={{ color: member.color }}>
                        {member.tagline}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
