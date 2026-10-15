"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MenuIcon, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";

import { MenuProvider, useMenu } from "./MenuContext";

import { MegaMenu } from "./MegaMenu";

import { FaTiktok, FaInstagram, FaDiscord } from "react-icons/fa6";
import { NavLink } from "./nav-link";
import { IconType } from "react-icons/lib";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const Navbar = () => {
  return (
    <MenuProvider>
      <NavbarInner />
    </MenuProvider>
  );
};

const NavbarInner = () => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);

  // underline animation for top nav
  const [underlineProps, setUnderlineProps] = useState({ width: 0, left: 0 });
  const navRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const moveUnderline = (key: string) => {
    const el = navRefs.current[key];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement!.getBoundingClientRect();
    setUnderlineProps({
      width: rect.width,
      left: rect.left - parentRect.left,
    });
  };

  useEffect(() => {
    setActive(pathname);
    moveUnderline(pathname || "/");
  }, [pathname]);

  const { openMenu, closeMenuDelayed } = useMenu();

  return (
    <nav
      className="
        sticky top-0 left-0 w-full h-[80px]
        bg-wds-nav-bg text-white border-b border-wds-nav-border/30
        flex items-center justify-between gap-6 px-4 md:px-10 lg:px-16 z-[999]
      "
    >
      {/* Logo — guideline "Small" size (100px band) */}
      <Link href="/" aria-label="We're Dad Studios — home" className="py-2">
        <Image
          src="/images/wds-mark-white.svg"
          width={112}
          height={46}
          alt="WDS"
          priority
          className="w-[88px] md:w-[112px] h-auto"
        />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-10 relative">
        <div className="relative flex items-center gap-6 lg:gap-10 font-agdasima text-[20px]">
          {/* animated underline */}
          <motion.div
            className="absolute bottom-[-8px] h-[3px] bg-brand-green"
            animate={{ width: underlineProps.width, x: underlineProps.left }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* HOME */}
          <div
            ref={(el) => {navRefs.current["/"] = el}}
            onMouseEnter={() => moveUnderline("/")}
          >
            <NavLink href="/" label="Home" active={active} />
          </div>

          {/* PROJECTS (mega menu trigger) */}
          <div
            className="relative outline-none"
            tabIndex={0}
            ref={(el) => {navRefs.current["/projects"] = el}}
            onMouseEnter={() => {
              moveUnderline("/projects");
              openMenu();
            }}
            onFocus={() => {
              moveUnderline("/projects");
              openMenu();
            }}
            onMouseLeave={closeMenuDelayed}
          >
            <div className="flex items-center gap-1">
              <NavLink
                href="/projects"
                label="Projects"
                active={active}
                onFocus={openMenu}
              />
              <ChevronDown className="w-4 h-4 mt-1 text-brand-mist" />
            </div>

            <MegaMenu />
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

          {/* LIBRARY */}
          <div
            ref={(el) => {navRefs.current["/library"] = el}}
            onMouseEnter={() => moveUnderline("/library")}
          >
            <NavLink href="/library" label="Library" active={active} />
          </div>
        </div>
      </div>

      {/* Search + Theme Toggle + CTA (socials live in the footer) */}
      <div className="hidden md:flex items-center gap-3">
        <SearchButton />
        <ThemeToggle />
        <Link
          href="/#flagships"
          className="cut-corners-sm hidden lg:inline-flex h-11 items-center px-5 bg-brand-pink text-brand-ink font-agdasima font-bold text-[19px] uppercase tracking-[0.06em] transition-colors hover:bg-[#F87FE2]"
        >
          Start reading
        </Link>
      </div>

      {/* Mobile */}
      <MobileMenu />
    </nav>
  );
};

const openSearch = () =>
  window.dispatchEvent(new CustomEvent("wds:open-search"));

const SearchButton = () => (
  <button
    onClick={openSearch}
    aria-label="Search"
    className="flex h-11 items-center gap-2 border border-white/50 px-3 font-agdasima text-[17px] text-white transition-colors hover:bg-white/10"
  >
    <Search className="h-4 w-4" />
    <span className="hidden xl:inline uppercase tracking-[0.06em]">Search</span>
    <kbd className="hidden xl:inline bg-white/15 px-1.5 font-agdasima text-[13px]">
      ⌘K
    </kbd>
  </button>
);

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-11 w-11 items-center justify-center hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </button>
  );
};

const SocialIcon = ({ href, Icon }: { href: string; Icon: IconType }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
    <Icon className="w-6 h-6 text-white" />
  </a>
);

const MobileMenu = () => {
  const path = usePathname();
  return (
    <div className="md:hidden flex items-center gap-2">
      <button
        onClick={openSearch}
        aria-label="Search"
        className="flex h-11 w-11 items-center justify-center hover:bg-white/10 transition-colors"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
      <ThemeToggle />
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label="Open menu"
            className="cut-corners-sm flex h-11 w-11 items-center justify-center bg-brand-pink text-brand-ink"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="
            md:hidden flex flex-col gap-4 p-6 font-agdasima text-[20px]
            bg-brand-indigo border border-white/25 border-t-4 border-t-brand-green
            rounded-none shadow-xl text-white
          "
        >
          <NavLink href="/" label="Home" active={path} />
          <NavLink href="/projects" label="Projects" active={path} />
          <NavLink href="/blog" label="Blog" active={path} />
          <NavLink href="/about-us" label="About Us" active={path} />
          <NavLink href="/library" label="Library" active={path} />

          <div className="flex gap-4 pt-2">
            <SocialIcon href="https://www.tiktok.com/@weredadstudios" Icon={FaTiktok} />
            <SocialIcon href="https://www.instagram.com/weredadstudios" Icon={FaInstagram} />
            <SocialIcon href="https://discord.gg/Vjjw2f42" Icon={FaDiscord} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
