"use client";

import Image from "next/image";
import Link from "next/link";
import { withFadeIn } from "@/utils/withFadeIn";
import { Entry } from "contentful";
import { Chapter } from "../page";
import { ChapterListComponent } from "../../components/chapter-list-component";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

function MainContent({
  relatedPosts,
  chapters,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedPosts: Entry<any>[];
  chapters: Chapter[];
}) {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* LEFT COLUMN */}
        <div className="flex-1 max-w-3xl">

          {/* Title Row */}
          <div className="flex items-center mb-4">
            <h1 className="text-heading text-white hover:text-primary-0 transition">
              Dawnshipper
            </h1>
            <span className="ml-auto px-3 py-1 text-sm rounded bg-[#F94C10] text-white">
              Novel
            </span>
          </div>

          {/* Cover Image */}
          <div className="rounded-xl overflow-hidden group shadow-xl">
            <Image
              src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1741439432/ds-main_lsc6ec.png"
              width={800}
              height={500}
              alt="Dawnshipper cover"
              className="w-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            />
          </div>

          {/* Genres */}
          <p className="text-subheading text-neutral_400 mt-6 mb-2">Genres</p>
          <div className="flex gap-2 flex-wrap">
            {["Dark Epic Fantasy", "Fantasy Tech", "Academy Fantasy"].map(
              (g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs font-semibold bg-white/10 text-white rounded-full hover:bg-primary-0 hover:text-black transition"
                >
                  {g}
                </span>
              )
            )}
          </div>

          {/* Description */}
          <h2 className="text-subheading text-neutral_400 mt-8">Description</h2>
          <p className="text-lg leading-loose text-neutral_300 mt-3">
            In the world of Thaloria, power is everything. Humans wield elemental
            magic by forming connections with Echoes—semi-sentient conduits of
            energy. The alliance between Sinai, Lothara, Baridi, and Umbralis
            teeters on collapse, as political tensions edge toward civil war.
            <br />
            <br />
            Devvyn, a stubborn lowborn troublemaker, forms an impossible bond
            with Flux—the Echo of Chaos—granting him magic that breaks the
            rules of the world. As new threats move across the continent, Devvyn
            must uncover the truth behind his family’s legacy... or become the
            spark that ignites Thaloria’s downfall.
          </p>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full lg:w-[400px] ml-auto lg:max-w-max max-w-screen-sm flex flex-col gap-10">

          {/* Chapters */}
          <div className="bg-white/5 border  border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-lg">
            <h3 className="text-subheading text-white mb-4">Read the Chapters</h3>
            <ChapterListComponent chapters={chapters} projectSlug="dawnshipper" />
          </div>

          {/* Social */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
            <p className="font-semibold text-white">Follow Us</p>
            <div className="flex justify-center mt-4 gap-2">
              <a
                href="https://www.tiktok.com/@weredadstudios?is_from_webapp=1&sender_device=pc"
                target="_blank"
                className="hover:scale-110 transition"
              >
                <FaTiktok className="w-7 h-7 text-white" />
              </a>
              <a
                href="https://www.instagram.com/weredadstudios?igsh=ZnQ5MDQzMW8zcWl6&utm_source=qr"
                target="_blank"
                className="hover:scale-110 transition"
              >
                <FaInstagram className="w-7 h-7 text-white" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED POSTS */}
      <div className="mt-16">
        <h2 className="text-subheading text-center text-neutral_300 mb-6">
          Related Posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <RelatedCard
              key={post.sys.id}
              title={post.fields.title as unknown as string}
              description={post.fields.description as unknown as string}
              to={`/blog/${post.sys.id}`}
            />
          ))}
         {relatedPosts.length === 0 && (
  <div className="w-max px-20 mx-auto py-10 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-center">
    <p className="text-neutral_300 text-lg font-medium">
      No related posts yet.
    </p>
    <p className="text-neutral_500 text-sm mt-1">
      More updates are coming soon.
    </p>
  </div>
) }
        </div>
      </div>
    </div>
  );
}

// ---- Related Card ----
function RelatedCard({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      href={to}
      className="group border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition shadow-lg"
    >
      <div className="aspect-video relative">
        <Image
          src="/images/WDS LOGO WHITE.png"
          alt={title}
          fill
          className="object-contain p-6 opacity-70"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-0 transition line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-neutral_400 mt-2 line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}

export const Main = withFadeIn(MainContent);
