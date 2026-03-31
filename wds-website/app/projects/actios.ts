"use server";
import { createContentfulClient } from "@/lib/contentful";
export const getTags=async()=>{
    
const client = createContentfulClient();
const tags = await client.getEntries({content_type:"tag"});
return tags.items;


}
