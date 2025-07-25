"--force-dynamic";
import { createClient } from "contentful";
import {Main} from "./_components/main"
import { getChapterList } from "@/lib/contentful";
import { Document } from "@contentful/rich-text-types";
import { Metadata } from "next";

export interface chapter  {
    id: string;
    title: string;
    slug: string;
    chapterNumber: number;
    volumeNumber: number;
    releaseDate: string;
    isFree: boolean;
    previewText: string;
    content:Document
}

  async function Page() {
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
    const chapters = await getChapterList("4HGkx2kqLJVyRRbFU3QUkB") as chapter[];

    const relatedPosts = (await client.getEntries({
        content_type:process.env.NEXT_PUBLIC_BLOGS_ID!,
        limit: 7,
        'fields.tags.sys.id':'43UEsDhn9X19AvFj1jxqos',
    })).items
    return (
       <div>
        <Main relatedPosts={relatedPosts} chapters={chapters}/>
       </div>
    );
}
export const generateMetadata = async (): Promise<Metadata> => {
    const description = `In the world of Thaloria, power is everything. Humans wield elemental magic by bonding with Echoes—semi-sentient conduits of power. As the alliance between Sinai, Lothara, Baridi, and Umbralis teeters on the brink of civil war, a deeper threat stirs beneath the surface. Amid this unrest, Devvyn—a lowborn troublemaker—forms a bond with Flux, the Echo of Chaos, gaining unstable powers that defy the rules of magic. As he unravels the mystery of his family’s lost legacy, Devvyn must choose between becoming Thaloria’s savior or its undoing.`;
  
    return {
      title: 'Dawnshipper | An Epic Fantasy of Magic, Chaos, and Legacy',
      description,
      keywords: [
        'Dawnshipper',
        'epic fantasy',
        'magic academy',
        'mana',
        'Flux Echo',
        'Echoes',
        'civil war fantasy',
        'Goldleaf Academy',
        'character-driven fantasy',
        'fantasy book series',
      ],
      openGraph: {
        title: 'Dawnshipper | An Epic Fantasy of Magic, Chaos, and Legacy',
        description,
        url: 'https://weredadstudios.com/projects/dawnshipper',
        type: 'website',
        images: [
          {
            url: 'https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png',
            width: 1200,
            height: 630,
            alt: 'Dawnshipper cover or banner image',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Dawnshipper | An Epic Fantasy of Magic, Chaos, and Legacy',
        description,
        images: ['https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png'],
      },
    }
}
  
export default Page;
 
