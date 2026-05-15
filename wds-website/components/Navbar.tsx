"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MenuIcon, Moon, Sun } from "lucide-react";
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
        bg-wds-nav-bg/40 backdrop-blur-xl border-b border-wds-nav-border/10
        flex items-center justify-between px-4 md:px-16 z-[999]
      "
    >
      {/* Logo */}
      <Link href="/">
        <Image
          src="/images/WDS LOGO WHITE.png"
          width={95}
          height={40}
          alt="WDS Logo"
          className="w-[95px] h-auto dark:invert-0 invert"
        />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-10 relative">
        <div className="relative flex items-center gap-10 font-agdasima text-[20px]">
          {/* animated underline */}
          <motion.div
            className="absolute bottom-[-6px] h-[2px] bg-purple-400 rounded"
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
              <ChevronDown className="w-4 h-4 mt-1 text-foreground" />
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
        </div>
      </div>

      {/* Social + Theme Toggle */}
      <div className="hidden md:flex items-center gap-6">
        <ThemeToggle />
        <SocialIcon href="https://www.tiktok.com/@weredadstudios" Icon={FaTiktok} />
        <SocialIcon href="https://www.instagram.com/weredadstudios" Icon={FaInstagram} />
        <SocialIcon href="https://discord.gg/Vjjw2f42" Icon={FaDiscord} />
      </div>

      {/* Mobile */}
      <MobileMenu />
    </nav>
  );
};

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
};

const SocialIcon = ({ href, Icon }: { href: string; Icon: IconType }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
    <Icon className="w-6 h-6 text-foreground" />
  </a>
);

const MobileMenu = () => {
  const path = usePathname();
  return (
    <div className="md:hidden flex items-center gap-2">
      <ThemeToggle />
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 rounded-md bg-purple-500 text-black">
            <MenuIcon className="w-6 h-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="
            md:hidden flex flex-col gap-4 p-6
            bg-background/90 backdrop-blur-xl border border-border
            rounded-xl shadow-xl text-foreground
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
    </div>
  );
};
