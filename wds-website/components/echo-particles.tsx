"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const EchoParticles = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

 const particles = Array.from({ length: 18 });
  
  
  // Echo element colors - luminescent orbs
 const echoColors = [
    { bg: "bg-orange-500", glow: "rgba(249, 115, 22, 0.8)", shadow: "0_0_30px_8px_rgba(249,115,22,0.6)" }, // Fire
    { bg: "bg-blue-400", glow: "rgba(96, 165, 250, 0.8)", shadow: "0_0_30px_8px_rgba(96,165,250,0.6)" }, // Water
    { bg: "bg-emerald-500", glow: "rgba(16, 185, 129, 0.8)", shadow: "0_0_30px_8px_rgba(16,185,129,0.6)" }, // Earth
    { bg: "bg-cyan-300", glow: "rgba(103, 232, 249, 0.8)", shadow: "0_0_30px_8px_rgba(103,232,249,0.6)" }, // Air
  ];
  return (
    <div
      className="
        fixed inset-0 pointer-events-none z-[99999]
        overflow-hidden
      "
    >
      {particles.map((_, i) => {
        const color = echoColors[i % echoColors.length];
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + Math.random() * 100;
        
        return (
           <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0.3,
              x: startX,
              y: startY,
            }}
            animate={{
              opacity: [0, 0.9, 1, 0.7, 0],
              scale: [0.3, 1.2, 1, 0.8, 0.4],
              x: [
                startX,
                startX + (Math.random() - 0.5) * 120,
                startX + (Math.random() - 0.5) * 80,
              ],
              y: [
                startY,
                startY - 250 - Math.random() * 150,
                startY - 400 - Math.random() * 200,
              ],
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.8,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.2, 0.5, 0.8, 1],
            }}
            className="absolute"
          >
            {/* Outer glow rings */}
            <div 
              className={`absolute ${color.bg} backdrop-blur-md rounded-full blur-2xl opacity-40`}
              style={{
                width: '48px',
                height: '48px',
                transform: 'translate(-24px, -24px)',
              }}
            />
            <div 
              className={`absolute ${color.bg} rounded-full blur-xl opacity-50`}
              style={{
                width: '32px',
                height: '32px',
                transform: 'translate(-16px, -16px)',
              }}
            />
            
            {/* Core light orb with radial gradient effect */}
            <div
              className="absolute w-[20px] h-[20px] rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, white, ${color.glow} 40%, ${color.glow.replace('0.8', '0.4')} 100%)`,
                boxShadow: `
                  ${color.shadow},
                  inset 0 0 8px rgba(255, 255, 255, 0.8),
                  inset -2px -2px 4px rgba(0, 0, 0, 0.3)
                `,
                transform: 'translate(-10px, -10px)',
              }}
            />
            
            {/* Bright highlight */}
            <div 
              className="absolute w-[5px] h-[5px] bg-white rounded-full blur-[1px]"
              style={{
                transform: 'translate(-8px, -8px)',
                opacity: 0.95,
              }}
            />
          </motion.div>
        )}
      )}
   </div>
    )}
