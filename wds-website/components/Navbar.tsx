"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MenuIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { FaTiktok, FaInstagram } from "react-icons/fa6";

export const Navbar = () => {
  const pathname = usePathname();

  // Page-transition-aware highlight
  const [active, setActive] = useState(pathname);
  useEffect(() => setActive(pathname), [pathname]);

  // Underline follow animation
  const [underlineProps, setUnderlineProps] = useState({
    width: 0,
    left: 0,
  });

  const navRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const moveUnderline = (key: string) => {
    const el = navRefs.current[key];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const offsetLeft = rect.left - el.parentElement!.getBoundingClientRect().left;

    setUnderlineProps({
      width: rect.width,
      left: offsetLeft,
    });
  };

  useEffect(() => {
    moveUnderline(active || "/");
  }, [active]);

  /* ------------------- MEGA MENU ------------------- */
  const [openMegaMenu, setOpenMegaMenu] = useState(false);

  return (
    <nav
      className="
        sticky top-0 left-0 w-full h-[80px] 
        bg-black/40 backdrop-blur-xl border-b border-white/10
        flex items-center justify-between px-4 md:px-16 z-[999]
      "
    >
      {/* LOGO */}
      <Link href="/">
        <Image
          src="/images/WDS LOGO WHITE.png"
          width={95}
          height={40}
          alt="WDS Logo"
          className="w-[95px] h-auto"
        />
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-10 relative">
        <div className="relative flex items-center gap-10 font-agdasima text-[20px]">

          {/* Animated underline */}
          <motion.div
            className="absolute bottom-[-6px] h-[2px] bg-primary-0 rounded"
            animate={{
              width: underlineProps.width,
              x: underlineProps.left,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* HOME */}
          <div
            ref={(el) => {navRefs.current["/"] = el}}
            onMouseEnter={() => moveUnderline("/")}
          >
            <NavLink href="/" label="Home" active={active} />
          </div>

          {/* PROJECTS — MEGA MENU */}
          <div
            className="relative"
            onMouseEnter={() => {
              moveUnderline("/projects");
              setOpenMegaMenu(true);
            }}
            onMouseLeave={() => setOpenMegaMenu(false)}
          >
            <div
              ref={(el) => {navRefs.current["/projects"] = el}}
              className="flex items-center gap-1"
            >
              <NavLink href="/projects" label="Projects" active={active} />
              <ChevronDown className="w-4 h-4 mt-1 text-white" />
            </div>

            {/* Mega menu panel */}
            {openMegaMenu && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="
                  absolute top-[40px] left-0 w-[500px]
                  bg-black/60 backdrop-blur-xl border border-white/10
                  rounded-xl shadow-xl p-6 grid grid-cols-2 gap-6
                  text-white
                "
              >
                {/* Column 1 */}
                <div className="flex flex-col gap-3">
                  <MegaMenuItem
                    title="Dawnshipper"
                    desc="Epic fantasy of mana, Echoes, & legacy."
                    href="/projects/dawnshipper"
                  />
                  <MegaMenuItem
                    title="Project Osiris"
                    desc="Supernatural sci-fi thriller with soul retrieval."
                    href="/projects/project_osiris"
                  />
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-3">
                  <MegaMenuItem
                    title="More Projects"
                    desc="Browse all WDS projects."
                    href="/projects"
                  />
                  <MegaMenuItem
                    title="WDS Blog"
                    desc="Behind-the-scenes writing, dev logs & lore."
                    href="/blog"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* BLOG */}
          <div
            ref={(el) => {navRefs.current["/blog"] = el}}
            onMouseEnter={() => moveUnderline("/blog")}
          >
            <NavLink href="/blog" label="Blog" active={active} />
          </div>

          {/* ABOUT */}
          <div
            ref={(el) => {navRefs.current["/about-us"] = el}}
            onMouseEnter={() => moveUnderline("/about-us")}
          >
            <NavLink href="/about-us" label="About Us" active={active} />
          </div>
        </div>
      </div>

      {/* SOCIAL ICONS */}
      <div className="hidden md:flex items-center gap-6">
        <SocialIcon href="https://www.tiktok.com/@weredadstudios" Icon={FaTiktok} />
        <SocialIcon href="https://www.instagram.com/weredadstudios" Icon={FaInstagram} />
      </div>

      {/* MOBILE MENU */}
      <MobileMenu />
    </nav>
  );
};

/* ---------------- NAV LINK ---------------- */
const NavLink = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: string;
}) => (
  <Link
    href={href}
    prefetch={true}
    className={`transition ${
      active === href ? "text-purple-600" : "text-white hover:text-purple-600"
    }`}
  >
    {label}
  </Link>
);

/* ---------------- MEGAMENU ITEM ---------------- */
const MegaMenuItem = ({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) => (
  <Link
    href={href}
    className="
      p-3 rounded-lg hover:bg-white/10 transition flex flex-col gap-1
    "
  >
    <p className="font-semibold">{title}</p>
    <p className="text-xs text-neutral-300 leading-snug">{desc}</p>
  </Link>
);

/* ---------------- SOCIAL ICON ---------------- */
const SocialIcon = ({
  href,
  Icon,
}: {
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
}) => (
  <a href={href} target="_blank" className="hover:scale-110 transition">
    <Icon className="w-6 h-6 text-white" />
  </a>
);

/* ---------------- MOBILE MENU ---------------- */
const MobileMenu = () => {
  const path = usePathname();
  return (
    <Popover>
      <PopoverTrigger className="md:hidden p-2 rounded-md bg-primary-0 text-black">
        <MenuIcon className="w-6 h-6" />
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        className="
          md:hidden flex flex-col gap-4 p-6 
          bg-black/70 backdrop-blur-xl border border-white/10
          rounded-xl shadow-xl text-white
        "
      >
        <NavLink href="/" label="Home" active={path} />
        <NavLink href="/projects" label="Projects" active={path} />
        <NavLink href="/blog" label="Blog" active={path} />
        <NavLink href="/about-us" label="About Us" active={path} />

        <div className="flex gap-4 pt-2">
          <SocialIcon href="https://www.tiktok.com/@weredadstudios" Icon={FaTiktok} />
          <SocialIcon href="https://www.instagram.com/weredadstudios" Icon={FaInstagram} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
