"use server";
import { createClient } from "contentful";
export const getTags=async()=>{
    
const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!
});
const tags = await client.getEntries({content_type:"tag"});
return tags.items;


}