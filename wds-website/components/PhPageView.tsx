"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function PageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const postHog = usePostHog();
    useEffect(()=>{
        if(pathname && postHog) {
            const fullPath = pathname + (searchParams ? `?${searchParams.toString()}` : '') + searchParams?.toString();
            postHog.capture('page_view', { path: fullPath });
        }
    },[pathname,searchParams,postHog])
    return (
        <></>
    );
}