"use server";
import { cookies } from "next/headers";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setCookie = (name: string, value: string, options: { [key: string]: any } = {}) => {
 
    const cookieStore = cookies();
    cookieStore.set({name, value, ...options});
}