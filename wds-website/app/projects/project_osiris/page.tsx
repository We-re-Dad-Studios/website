// app/projects/project_osiris/page.tsx
import { createClient } from "contentful";
import { Main } from "./_components/main";
import { getChapterList } from "@/lib/contentful";
type chapter={
  id:string,slug:string,title:string,chapterNumber:number|string,isFree:boolean,releaseDate:string
}
export const dynamic = "force-dynamic";

export default async function Page() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!,
  });

  const relatedPosts = (
    await client.getEntries({
      content_type: process.env.BLOGS_ID!,
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
