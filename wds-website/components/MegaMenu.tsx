"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "./MenuContext";
import { MegaMenuColumn } from "./mega-menu-column";
const menuAnimation = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.97 },
  transition: {
    duration: 0.18,
    ease: [0.16, 1, 0.3, 1],
  },
};

export const MegaMenu = () => {
  const { open, openMenu, closeMenuDelayed, menuRef } = useMenu();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...menuAnimation}
          ref={menuRef}
          className="
            absolute left-1/2 -translate-x-1/2 top-[48px]
            w-[540px] bg-black/60 backdrop-blur-xl
            border border-white/10 rounded-xl shadow-xl
            p-6 grid grid-cols-2 gap-6 text-white z-50
          "
          onMouseEnter={openMenu}
          onMouseLeave={closeMenuDelayed}
        >
          <MegaMenuColumn
            items={[
              {
                key: "dawn",
                title: "Dawnshipper",
                desc: "Epic fantasy of mana, Echoes, & legacy.",
                href: "/projects/dawnshipper",
              },
              {
                key: "osiris",
                title: "Project Osiris",
                desc: "Supernatural sci-fi thriller with soul retrieval.",
                href: "/projects/project_osiris",
              },
            ]}
          />

          <MegaMenuColumn
            items={[
              {
                key: "more",
                title: "More Projects",
                desc: "Browse all WDS projects.",
                href: "/projects",
              },
              {
                key: "blog",
                title: "WDS Blog",
                desc: "Behind-the-scenes writing, dev logs & lore.",
                href: "/blog",
              },
            ]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
