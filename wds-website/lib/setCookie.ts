"use server";
import { cookies } from "next/headers";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setCookie = async (name: string, value: string, options: { [key: string]: any } = {}) => {
    const cookieStore = await cookies();
    cookieStore.set({name, value, ...options});
}
