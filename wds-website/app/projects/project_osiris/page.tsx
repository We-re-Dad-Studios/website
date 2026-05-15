// app/projects/project_osiris/page.tsx
import { Metadata } from "next";
import { createContentfulClient, getBlogContentTypeId, getChapterList } from "@/lib/contentful";
import { Main } from "@/components/osiris-restructured";
type chapter={
  id:string,slug:string,title:string,chapterNumber:number|string,isFree:boolean,releaseDate:string
}
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Project Osiris | Supernatural Sci-Fi Thriller",
  description:
    "Death is negotiable — for a price. Read the supernatural sci-fi thriller from We're Dad Studios.",
  openGraph: {
    title: "Project Osiris | Supernatural Sci-Fi Thriller",
    description:
      "Death is negotiable — for a price. Read the supernatural sci-fi thriller from We're Dad Studios.",
    url: "https://weredadstudios.com/projects/project_osiris",
    images: [
      {
        url: "https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Osiris | Supernatural Sci-Fi Thriller",
    description:
      "Death is negotiable — for a price. Read the supernatural sci-fi thriller from We're Dad Studios.",
  },
  alternates: { canonical: "https://weredadstudios.com/projects/project_osiris" },
};

export default async function Page() {
  const client = createContentfulClient();

  const relatedPosts = (
    await client.getEntries({
      content_type: getBlogContentTypeId(),
      limit: 7,
      "fields.tags.sys.id": "3vpLAavSzdhisJZebqZrtu",
    })
  ).items;

  const chapters = (await getChapterList(
    "1xuruQrzy6FbZDqnBVtsEk"
  )) as chapter[];

  return (
    <div className="w-full">
      <Main relatedPosts={relatedPosts} chapters={chapters} />
    </div>
  );
}
