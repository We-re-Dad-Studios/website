"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Users } from 'lucide-react';

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
    stats: {
    
      specialty: "Gameplay Mechanics"
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
  },
  {
    id: 2,
    name: "Ehiosu",
    role: "Co-founder,Lead",
    tagline: "The 'what if we try...' guy.",
    bio: "I’m the “what if we try…” guy,the one jumping between stories, games, and animations to make sure every idea hits its spark. If I’m not the one who started it, I’m definitely the one poking it until it shines.",
    image: "/images/ehi-2.png",
    color: "#F94C10",
    gradient: "from-orange-600 to-red-900",
    stats: {
      specialty: "Gameplay Mechanics"
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
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
    stats: {
      specialty: "Ego"
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
  },
  {
    id: 4,
    name: "Adamns",
    role: "Co-founder",
    tagline: "Idea validator",
    bio: "Crafting compelling narratives that resonate with audiences across all mediums.",
    image: "/images/smada.png",
    color: "#18F24B",
    gradient: "from-violet-600 to-purple-900",
    stats: {
      specialty: "Systems"
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
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
    stats: {
      specialty: "Builder and Destroyer of worlds."
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
  },
  {
    id: 6,
    name: "Tired Gremlin",
    role: "Writing Lead",
    tagline: "Story Alchemist",
    bio: "Visionary storyteller with 7+ years of experience building immersive worlds across short stories, novels and animation.",
    image: "/images/tg.png",
    color: "#caffbf",
    gradient: "from-indigo-600 to-purple-900",
    stats: {
      specialty: "Creative Writing"
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
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
    stats: {
      specialty: "Character Art"
    },
    social: { twitter: "#", instagram: "#", linkedin: "#" }
  }
];

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  // const [hoveredMember, setHoveredMember] = useState<number|null>(null);

  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setSelectedMember((prev) => (prev + 1) % teamMembers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const handleMemberSelect = (index:number) => {
    setSelectedMember(index);
    setIsAutoCycling(false);
    setTimeout(() => setIsAutoCycling(true), 15000);
  };

  const currentMember = teamMembers[selectedMember];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 ">
        <motion.div 
          className="relative z-10 text-center max-w-6xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src="/images/WDS LOGO WHITE.png" 
              alt="WDS"
              className="w-48 h-48 mx-auto mb-8 drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
            />
          </motion.div> */}
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              WE&apos;RE DAD
            </span>
            <br />
            <span className="text-white">STUDIOS</span>
          </motion.h1>
          
          <motion.div 
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Crafting immersive worlds through games, novels, manga, and animation.
            <br />
            <span className="text-purple-400">Where imagination meets innovation.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <a 
              href="#team"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
            >
              Meet The Team
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-purple-500 rounded-full flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            {[
              { icon: Users, label: "Team Members", value: teamMembers.length, color: "purple" },
        
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center hover:border-purple-500/50 transition-all">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 text-${stat.color}-500`} />
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Gaming Style */}
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
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative"
              >
                {/* Glowing Background */}
                <div 
                  className={`absolute -inset-4 bg-gradient-to-r ${currentMember.gradient} opacity-20 blur-3xl rounded-3xl`}
                />
                
                <div className="relative bg-black/60 backdrop-blur-xl border-4 rounded-3xl overflow-hidden"
                  style={{ borderColor: currentMember.color }}
                >
                  <div className="grid lg:grid-cols-2 gap-8 p-8">
                    {/* Character Visual */}
                    <div className="relative">
                      <motion.div 
                        className="relative aspect-square md:w-full w-[70%] mx-auto rounded-2xl overflow-hidden"
                        animate={{ 
                          boxShadow: `0 0 80px ${currentMember.color}80` 
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <div 
                          className={`absolute inset-0 bg-gradient-to-br ${currentMember.gradient} opacity-30`}
                        />
                        <div className='w-full h-full rounded overflow-hidden'>
                            <img 
                          src={currentMember.image}
                          alt={currentMember.name}
                          className="relative w-full h-full object-contain object-top   drop-shadow-2xl"
                        />
                        </div>
                        
                        {/* Corner Decorations */}
                        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                          <div
                            key={pos}
                            className={`absolute w-8 h-8 border-2 ${
                              pos.includes('top') ? 'top-4' : 'bottom-4'
                            } ${
                              pos.includes('left') ? 'left-4' : 'right-4'
                            } ${
                              pos.includes('top') && pos.includes('left') ? 'border-r-0 border-b-0' :
                              pos.includes('top') && pos.includes('right') ? 'border-l-0 border-b-0' :
                              pos.includes('bottom') && pos.includes('left') ? 'border-r-0 border-t-0' :
                              'border-l-0 border-t-0'
                            }`}
                            style={{ borderColor: currentMember.color }}
                          />
                        ))}
                      </motion.div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {Object.entries(currentMember.stats).map(([key, value]) => (
                          <motion.div
                            key={key}
                            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center"
                            whileHover={{ scale: 1.05, borderColor: currentMember.color }}
                          >
                            <div className="text-lg lg:text-2xl font-bold" style={{ color: currentMember.color }}>
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
                          <div className="text-sm font-bold mb-2" style={{ color: currentMember.color }}>
                            {currentMember.tagline.toUpperCase()}
                          </div>
                          <h3 className="text-2xl lg:text-5xl font-bold mb-2">{currentMember.name}</h3>
                          <div className="text-[18px] lg:text-2xl text-gray-400 mb-4">{currentMember.role}</div>
                          <div className="h-1 w-24 rounded-full mb-6" style={{ backgroundColor: currentMember.color }} />
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg text-gray-300 leading-relaxed mb-8"
                        >
                          {currentMember.bio}
                        </motion.p>

                        {/* Ability Bar Visualization */}
                        <div className="space-y-3 mb-8">
                          {['Creativity', 'Technical', 'Leadership'].map((skill, i) => (
                            <div key={skill}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">{skill}</span>
                                <span style={{ color: currentMember.color }}>{85 + i * 5}%</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: currentMember.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${85 + i * 5}%` }}
                                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
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
                  <div className={`w-2 h-2 rounded-full ${isAutoCycling ? 'bg-green-500' : 'bg-gray-500'} animate-pulse`} />
                  <span className="text-sm text-gray-400">
                    {isAutoCycling ? 'Auto-Cycling' : 'Manual'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {teamMembers.map((member, index) => (
                  <motion.button
                    key={member.id}
                    onClick={() => handleMemberSelect(index)}
                    // onMouseEnter={() => setHoveredMember(index)}
                    // onMouseLeave={() => setHoveredMember(null)}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all"
                      style={{
                        borderColor: selectedMember === index ? member.color : 'rgba(255,255,255,0.1)',
                        boxShadow: selectedMember === index ? `0 0 30px ${member.color}80` : 'none'
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-40`} />
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="relative w-full h-full object-cover object-top"
                      />
                      
                      {selectedMember === index && (
                        <motion.div 
                          className="absolute inset-0 border-2"
                          style={{ borderColor: member.color }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3`}>
                        <div className="w-full">
                          <div className="text-xs font-bold truncate">{member.name}</div>
                          <div className="text-xs text-gray-400 truncate">{member.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Name Label */}
                    <div className="mt-2 text-center">
                      <div className="text-sm font-bold truncate">{member.name}</div>
                      <div className="text-xs" style={{ color: member.color }}>{member.tagline}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <motion.div 
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">
            Ready to <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Level Up</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community and be part of the adventure
          </p>
        
        </motion.div>
      </section>
    </div>
  );
}