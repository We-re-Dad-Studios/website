"use client";

// Link-in-bio list. Every click is tracked as `link_click` so we can see
// which links people actually use from social profiles.

import Link from "next/link";
import type { ComponentType } from "react";
import { usePostHog } from "posthog-js/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaDiscord, FaInstagram, FaTiktok } from "react-icons/fa6";
import { ROYAL_ROAD_LINKS } from "@/lib/royal-road";

type Accent = "pink" | "green" | "white";

type LinkItem = {
  id: string;
  label: string;
  sub?: string;
  href: string;
  accent?: Accent;
};

const SECTIONS: { title: string; items: LinkItem[] }[] = [
  {
    title: "Read",
    items: [
      {
        id: "dawnshipper-royal-road",
        label: "Dawnshipper",
        sub: "Dark epic fantasy · read on Royal Road",
        href: ROYAL_ROAD_LINKS.dawnshipper,
        accent: "pink",
      },
      {
        id: "osiris-royal-road",
        label: "Project Osiris",
        sub: "Sci-fi thriller · read on Royal Road",
        href: ROYAL_ROAD_LINKS.project_osiris,
        accent: "green",
      },
    ],
  },
  {
    title: "Play",
    items: [
      { id: "afterlives", label: "Afterlives", sub: "Mythic action game · in development", href: "/projects/afterlives" },
      { id: "stryfe", label: "Stryfe (Hex War)", sub: "5v5 team arena · in development", href: "/projects/stryfe" },
    ],
  },
  {
    title: "Studio",
    items: [
      { id: "discord", label: "Join the Discord", sub: "Theories, dev logs, release-day chaos", href: "https://discord.gg/Vjjw2f42" },
      { id: "blog", label: "Studio blog", sub: "Behind the scenes, lore and updates", href: "/blog" },
      { id: "website", label: "weredadstudios.com", sub: "Everything else", href: "/" },
    ],
  },
];

const SOCIALS: { id: string; label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@weredadstudios", Icon: FaTiktok },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/weredadstudios", Icon: FaInstagram },
  { id: "discord-icon", label: "Discord", href: "https://discord.gg/Vjjw2f42", Icon: FaDiscord },
];

const ACCENT_BAR: Record<Accent, string> = {
  pink: "bg-brand-pink",
  green: "bg-brand-green",
  white: "bg-brand-indigo",
};

const isExternal = (href: string) => href.startsWith("http");

export function LinkTree() {
  const posthog = usePostHog();
  const track = (id: string, href: string) => posthog?.capture("link_click", { link: id, href, page: "links" });

  return (
    <div className="flex flex-col gap-9">
      <ul className="m-0 flex list-none justify-center gap-3 p-0" aria-label="Social profiles">
        {SOCIALS.map(({ id, label, href, Icon }) => (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={() => track(id, href)}
              className="flex h-12 w-12 items-center justify-center border-2 border-white/70 text-white transition-colors hover:bg-white hover:text-brand-indigo"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        ))}
      </ul>

      {SECTIONS.map((section) => (
        <section key={section.title} aria-labelledby={`links-${section.title}`}>
          <h2
            id={`links-${section.title}`}
            className="m-0 mb-3 border-b border-white/30 pb-2 font-plaguard text-[22px] font-normal leading-none text-white"
          >
            {section.title}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {section.items.map((item) => (
              <li key={item.id}>
                <LinkCard item={item} onClick={() => track(item.id, item.href)} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function LinkCard({ item, onClick }: { item: LinkItem; onClick: () => void }) {
  const external = isExternal(item.href);
  const body = (
    <>
      <span aria-hidden="true" className={`w-2 shrink-0 self-stretch ${ACCENT_BAR[item.accent ?? "white"]}`} />
      <span className="min-w-0 flex-1 py-3">
        <span className="block text-[21px] font-bold leading-tight text-brand-ink">{item.label}</span>
        {item.sub && <span className="block text-[16px] leading-snug text-brand-muted">{item.sub}</span>}
      </span>
      {external ? (
        <ArrowUpRight className="mr-4 h-5 w-5 shrink-0 text-brand-indigo" strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <ArrowRight className="mr-4 h-5 w-5 shrink-0 text-brand-indigo transition-transform group-hover:translate-x-1" strokeWidth={2.5} aria-hidden="true" />
      )}
    </>
  );
  const cls = "group flex min-h-[64px] items-center gap-4 transition-colors hover:bg-brand-lilac";

  return (
    <div className="cut-tr-sm overflow-hidden bg-white">
      {external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
          {body}
        </a>
      ) : (
        <Link href={item.href} onClick={onClick} className={cls}>
          {body}
        </Link>
      )}
    </div>
  );
}
