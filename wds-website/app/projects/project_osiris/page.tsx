// app/projects/project_osiris/page.tsx
// import { Main } from "./_components/main";
import { createContentfulClient, getBlogContentTypeId, getChapterList } from "@/lib/contentful";
import { Main } from "@/components/osiris-restructured";
type chapter={
  id:string,slug:string,title:string,chapterNumber:number|string,isFree:boolean,releaseDate:string
}
export const revalidate = 60;

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
