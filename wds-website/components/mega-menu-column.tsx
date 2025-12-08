"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

interface Props {
  items: {
    title: string;
    desc: string;
    href: string;
    key: string;
  }[];
}

export const MegaMenuColumn = ({ items }: Props) => {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [underline, setUnderline] = useState({ width: 0, left: 0 });

  const moveUnderline = (key: string) => {
    const el = refs.current[key];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement!.getBoundingClientRect();

    setUnderline({
      width: rect.width,
      left: rect.left - parentRect.left,
    });
  };

  return (
    <div className="relative flex flex-col gap-3">
      {/* Column underline */}
      <motion.div
        className="absolute top-0 h-[2px] bg-purple-400"
        animate={{ width: underline.width, x: underline.left }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />

      {items.map((item) => (
        <div
          key={item.key}
          ref={(el) => {refs.current[item.key] = el as HTMLDivElement}}
          onMouseEnter={() => moveUnderline(item.key)}
        >
          <Link
            href={item.href}
            className="p-3 rounded-lg hover:bg-white/10 transition flex flex-col gap-1"
          >
            <p className="font-semibold">{item.title}</p>
            <p className="text-xs text-neutral-300 leading-snug">
              {item.desc}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
};
