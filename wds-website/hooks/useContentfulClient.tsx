"use client";   
import { createClient } from "contentful";
import { useRef } from "react";
export const useContentfulClient = () => {
 const clientRef = useRef<ReturnType<typeof createClient>>();
 console.log({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
})
 if (!clientRef.current) {
    clientRef.current   = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
    });
 };
 return clientRef.current;
}
