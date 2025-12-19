"use client";

import { NewsletterModal } from "@/components/newslettermodal";
import { useParams } from "next/navigation";

export default function Layout({children}: {children: React.ReactNode}) {
    const {slug:novel}=useParams();
  const novelDisplayName = `${(novel as string)[0].toUpperCase()}${(novel as string).replace("_", " ").slice(1)}`;

    return (
        <section>
            <NewsletterModal
  triggerAt={45}
  delay={3000}
  novelName={novelDisplayName}
  exitIntent={true}
/>
            {children}
        </section>
    );
}