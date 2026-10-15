"use client";

// Dawnshipper landing page — content only; layout lives in components/novel/NovelPage.

import { Entry } from "contentful";
import { withFadeIn } from "@/utils/withFadeIn";
import { Chapter } from "@/app/projects/dawnshipper/page";
import { Highlight, NovelPage } from "@/components/novel/NovelPage";

function MainContent({
  relatedPosts,
  chapters,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedPosts: Entry<any>[];
  chapters: Chapter[];
}) {
  return (
    <NovelPage
      slug="dawnshipper"
      title="Dawnshipper"
      genre="Dark epic fantasy"
      accent="pink"
      poster={{
        src: "/images/devvyn-hero.jpg",
        alt: "Devvyn, the hero of Dawnshipper, with pink Echo magic coiling around his fist",
        position: "object-[center_12%]",
      }}
      hook={
        <>
          He bonded with <Highlight accent="pink">something he shouldn&apos;t have</Highlight> — an
          impossible connection that breaks the rules of magic. Now hunted by those who&apos;d
          weaponize him and feared by those who&apos;d destroy him.
        </>
      }
      story={[
        "In the world of Thaloria, power is everything. Humans wield elemental magic by forming connections with Echoes—semi-sentient conduits of energy. The alliance between the powers teeters on collapse, as political tensions edge toward civil war.",
        "Devvyn, a stubborn lowborn troublemaker, forms an impossible bond, granting him powers that break the rules of the world. As new threats move across the continent, Devvyn must uncover the truth behind his family's legacy... or become the spark that ignites Thaloria's downfall.",
      ]}
      tags={["Dark epic fantasy", "Magic system", "Academy", "Political intrigue", "Found family"]}
      reasonsTitle="Why readers love it"
      reasons={[
        "A grounded yet powerful magic system shaped by elemental Echoes",
        "An academy arc filled with ambition, rivalry, and brutal trials",
        "A continent on the edge of civil war",
        "Antagonists with real motives—not filler villains",
        "A story that rewards careful reading and theory-crafting",
      ]}
      cadence="Updates daily"
      chapters={chapters}
      relatedPosts={relatedPosts}
    />
  );
}

export const Main = withFadeIn(MainContent);
