"--force-dynamic";
import { createClient } from "contentful";
import {Main} from "./_components/main"
import { getChapterList } from "@/lib/contentful";
import { chapter } from "../dawnshipper/page";
  async function Page() {
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
    const relatedPosts = (await client.getEntries({
        content_type:process.env.NEXT_PUBLIC_BLOGS_ID!,
        limit: 7,
        'fields.tags.sys.id':'3vpLAavSzdhisJZebqZrtu',
    })).items
    const chapters = await getChapterList("1xuruQrzy6FbZDqnBVtsEk") as chapter[];
    return (
       <div>
        <Main relatedPosts={relatedPosts} chapters={chapters}/>
       </div>
    );
}
export default Page;

