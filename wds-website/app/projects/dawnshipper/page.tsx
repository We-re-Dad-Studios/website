// app/projects/dawnshipper/page.tsx
import { Metadata } from "next";
import { getChapterList } from "@/lib/contentful";
import { Main } from "./_components/main";
import { createClient } from "contentful";

export const dynamic = "force-dynamic";

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  volumeNumber: number;
  releaseDate: string;
  isFree: boolean;
  previewText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

async function Page() {
  const chapters = (await getChapterList("4HGkx2kqLJVyRRbFU3QUkB")) as Chapter[];

  // secure client (server-only)
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!,
  });

  const relatedPosts = (
    await client.getEntries({
      content_type: process.env.BLOGS_ID!,
      limit: 7,
      "fields.tags.sys.id": "43UEsDhn9X19AvFj1jxqos",
    })
  ).items;

  return (
    <div className="w-full">
      <Main relatedPosts={relatedPosts} chapters={chapters} />
    </div>
  );
}

export default Page;

// --- Metadata ---
export const generateMetadata = async (): Promise<Metadata> => {
  const description = `In Thaloria, power flows through Echoes—semi-sentient manifestations of elemental magic. As alliances fracture and ancient forces awaken, Devvyn, a lowborn troublemaker, bonds with Flux, the Echo of Chaos—an impossible bond that threatens the balance of the continent.`;

  return {
    title: "Dawnshipper | Epic Fantasy of Magic, Chaos & Legacy",
    description,
    openGraph: {
      title: "Dawnshipper | Epic Fantasy of Magic, Chaos & Legacy",
      description,
      url: "https://weredadstudios.com/projects/dawnshipper",
      images: [
        {
          url: "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dawnshipper | Epic Fantasy of Magic, Chaos & Legacy",
      description,
      images: [
        "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png",
      ],
    },
  };
};
