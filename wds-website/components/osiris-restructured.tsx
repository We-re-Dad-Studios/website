"use client";

// Project Osiris landing page — content only; layout lives in components/novel/NovelPage.

import { Entry } from "contentful";
import { Highlight, NovelChapter, NovelPage } from "@/components/novel/NovelPage";

export function Main({
  relatedPosts,
  chapters,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedPosts: Entry<any>[];
  chapters: NovelChapter[];
}) {
  return (
    <NovelPage
      slug="project_osiris"
      title="Project Osiris"
      genre="Sci-fi thriller"
      accent="green"
      poster={{
        src: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg",
        alt: "Team Zero fighting through the Light",
        position: "object-center",
      }}
      hook={
        <>
          Death is now <Highlight accent="green">negotiable</Highlight> — resurrection has become
          commercialized. Professional Walkers brave the Light to snatch souls back from the death
          gods themselves. But the price of defying death is steeper than humanity can pay.
        </>
      }
      story={[
        "In the near future, death has become negotiable—but only for the wealthy. Thanks to Osiris Inc., the world's first soul-retrieval company, anyone can be brought back—as long as their Time of Death hasn't exceeded 48 hours.",
        "Walkers, elite operatives trained to extract souls within a dangerous liminal realm called the Light, maintain this impossible industry. But missions are failing. Teams are disappearing.",
        "When seventeen-year-old Sami Illia becomes the sole survivor of a catastrophic retrieval mission, he is reassigned to Team Zero—an outcast squad no one expects to succeed. But Sami knows what he saw in the Light… and it is getting stronger.",
      ]}
      tags={["Science fantasy", "Supernatural thriller", "Dystopian", "Corporate horror", "Team dynamics"]}
      reasonsTitle="Why you'll love it"
      reasons={[
        "A haunting liminal realm where the rules of reality don't apply",
        "Corporate dystopia meets supernatural horror",
        "A misfit team forced to confront impossible odds",
        "Mystery that deepens with every mission",
        "A protagonist who knows too much—and can't prove any of it",
      ]}
      cadence="Updates regularly"
      chapters={chapters}
      relatedPosts={relatedPosts}
    />
  );
}
