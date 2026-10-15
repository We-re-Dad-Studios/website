"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { BrandStripes } from "@/components/BrandStripes";

// Member accents rotate through the brand: Pink Fantasy, Electric Green, and a
// lifted indigo that reads on Ink. All take Ink text when used as a fill.
const ACCENTS = ["#F659DA", "#34F58C", "#A5A2FF"] as const;

const teamMembers = [
  {
    id: 1,
    name: "Frankln",
    role: "Co-founder, Lead",
    tagline: "World Builder",
    bio: "Visionary storyteller with 10+ years of experience crafting immersive worlds across games, novels, and animation.",
    image: "/images/grandfather.png",
    specialty: "Gameplay Mechanics",
  },
  {
    id: 2,
    name: "Ehiosu",
    role: "Co-founder, Lead",
    tagline: "The 'what if we try...' guy.",
    bio: `I'm the "what if we try…" guy, the one jumping between stories, games, and animations to make sure every idea hits its spark. If I'm not the one who started it, I'm definitely the one poking it until it shines.`,
    image: "/images/ehi-2.png",
    specialty: "Gameplay Mechanics",
  },
  {
    id: 3,
    name: "Praise",
    role: "Co-founder",
    tagline: "Visual Storyteller",
    bio: "Master of visual storytelling, creating stunning artwork that brings characters and worlds to life.",
    image: "/images/bamiyo.png",
    specialty: "Ego",
  },
  {
    id: 4,
    name: "Adams",
    role: "Co-founder",
    tagline: "Idea validator",
    bio: "Crafting compelling narratives that resonate with audiences across all mediums.",
    image: "/images/smada.png",
    specialty: "Systems",
  },
  {
    id: 5,
    name: "El' Agbon",
    role: "Creative Lead",
    tagline: "The Sandman",
    bio: "I am where ideas come to die, decay and then reanimate to walk the realms of men, undead and eternal. I am what happens when nightmares clash with daydreams for the mind of the dreamer. I am a blackhole drawing you into nothingness, daring you to leap into the unknown. For where else will you find life's greatest wonders? I am destiny's squire. I am your path to worlds you thought you knew. I am the end of the beginning. Fear me, for this path I shepherd you on, leads to madness.",
    image: "/images/el.png",
    specialty: "Builder and Destroyer of worlds.",
  },
  {
    id: 6,
    name: "Tired Gremlin",
    role: "Writing Lead",
    tagline: "Story Alchemist",
    bio: "Visionary storyteller with 7+ years of experience building immersive worlds across short stories, novels and animation.",
    image: "/images/tg.png",
    specialty: "Creative Writing",
  },
  {
    id: 7,
    name: "Juwon",
    role: "Artist",
    tagline: "Painter of impossible worlds.",
    bio: "A concept, comic book and character illustrator with 7+ years of experience in concept art, character designs and comic book illustrations.",
    image: "/images/WDS LOGO WHITE.png",
    specialty: "Character Art",
  },
].map((m, i) => ({ ...m, accent: ACCENTS[i % ACCENTS.length] }));

// A member without a real headshot falls back to the logo path; treat that as
// "no photo yet" and render a branded initial instead of a cropped logo.
const hasPhoto = (image: string) => !image.includes("WDS LOGO");

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!isAutoCycling || paused) return;
    const interval = setInterval(() => {
      setSelectedMember((prev) => (prev + 1) % teamMembers.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isAutoCycling, paused]);

  const handleMemberSelect = (index: number) => {
    setSelectedMember(index);
    setIsAutoCycling(false);
    setTimeout(() => setIsAutoCycling(true), 15000);
  };

  const m = teamMembers[selectedMember];

  return (
    <section id="team" className="relative scroll-mt-20 overflow-hidden bg-brand-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-t-2 border-white/80 pb-5 pt-4">
          <h2 className="m-0 font-plaguard text-[38px] font-normal leading-none sm:text-[56px]">
            Select your <span className="text-brand-pink">character</span>
          </h2>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex h-11 items-center gap-2 border border-white/50 px-3 text-[16px] uppercase tracking-[0.1em] text-brand-mist transition-colors hover:bg-white/10 hover:text-white"
          >
            {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            {paused ? "Auto-cycle off" : isAutoCycling ? "Auto-cycling" : "Manual"}
          </button>
        </div>

        {/* Selected member */}
        <div className="mt-10" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.article
              key={selectedMember}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid gap-8 border border-white/10 bg-[#16134A] p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
              style={{ borderTop: `4px solid ${m.accent}` }}
            >
              <div className="relative mx-auto w-[75%] max-w-[420px] lg:w-full">
                <div
                  aria-hidden="true"
                  className="cut-corners-lg absolute inset-0 translate-x-3 translate-y-3"
                  style={{ backgroundColor: m.accent }}
                />
                <div className="cut-corners-lg relative aspect-square overflow-hidden bg-brand-indigo">
                  <BrandStripes className="left-0 top-0 h-full w-[45%]" />
                  {hasPhoto(m.image) ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 1024px) 75vw, 420px"
                      priority
                      className="object-contain object-bottom"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-plaguard text-[120px] leading-none text-white">{m.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-center">
                <span
                  className="self-start px-2.5 py-1 text-[15px] font-bold uppercase tracking-[0.12em] text-brand-ink"
                  style={{ backgroundColor: m.accent }}
                >
                  {m.tagline}
                </span>
                <h3 className="mb-2 mt-5 font-plaguard text-[44px] font-normal leading-none sm:text-[60px]">{m.name}</h3>
                <p className="m-0 text-[20px] uppercase tracking-[0.08em] text-brand-mist sm:text-[22px]">{m.role}</p>
                <p className="mb-0 mt-6 max-w-[620px] text-[19px] leading-[1.55] text-[#DCDBF7] sm:text-[21px]">{m.bio}</p>
                <dl className="m-0 mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/15 pt-5">
                  <dt className="text-[15px] font-bold uppercase tracking-[0.12em] text-brand-mist">Specialty</dt>
                  <dd className="m-0 text-[21px] font-bold" style={{ color: m.accent }}>{m.specialty}</dd>
                </dl>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Roster */}
        <div className="mt-10">
          <h3 className="m-0 mb-5 text-[18px] font-bold uppercase tracking-[0.14em] text-brand-mist">Roster</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {teamMembers.map((member, index) => {
              const selected = selectedMember === index;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleMemberSelect(index)}
                  aria-pressed={selected}
                  aria-label={`${member.name}, ${member.role}`}
                  className="group text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                >
                  <div
                    className="relative aspect-square overflow-hidden bg-brand-indigo transition-transform group-hover:-translate-y-1"
                    style={{ outline: selected ? `3px solid ${member.accent}` : "1px solid rgba(255,255,255,0.15)", outlineOffset: selected ? 3 : 0 }}
                  >
                    {hasPhoto(member.image) ? (
                      <Image
                        src={member.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-plaguard text-[44px] leading-none text-white">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <div className="truncate text-[17px] font-bold text-white">{member.name}</div>
                    <div className="truncate text-[15px]" style={{ color: member.accent }}>
                      {member.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
