"use server";
import { createClient } from "contentful";
import {Main} from "./_components/main"
  async function Page() {
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
    const relatedPosts = (await client.getEntries({
        content_type:process.env.NEXT_PUBLIC_BLOGS_ID!,
        limit: 7,
        'fields.tags.sys.id':'43UEsDhn9X19AvFj1jxqos',
    })).items
    return (
       <div>
        <Main relatedPosts={relatedPosts}/>
       </div>
    );
}
export default Page;

