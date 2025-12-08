"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Entry } from "contentful";
import { ChapterListComponent } from "../../components/chapter-list-component";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

type Chapter = {
  id: string;
  slug: string;
  title: string;
  chapterNumber: number | string;
  isFree: boolean;
  releaseDate: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function OsirisContent({
  relatedPosts,
  chapters,
}: {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedPosts: Entry<any>[];
  chapters: Chapter[];
}) {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">

      {/* ---------------- MOBILE STICKY CTA ---------------- */}
      <Link
        href="#chapters"
        className="lg:hidden fixed bottom-4 right-4 bg-primary-0 text-black px-5 py-3 rounded-full font-semibold shadow-xl z-50 active:scale-95 transition-transform"
      >
        Start Reading
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ---------------- CHAPTERS FIRST ON MOBILE ---------------- */}
        <aside
          id="chapters"
          className="order-1 lg:order-2 w-full lg:w-[400px] lg:max-w-max max-w-screen-sm flex flex-col gap-10"
        >
          {/* Chapters */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-lg"
          >
            <h3 className="text-subheading text-white mb-4 flex items-center gap-2">
              📖 Read the Chapters
            </h3>
            <ChapterListComponent chapters={chapters} projectSlug="project_osiris" />
          </motion.div>

          {/* Social */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm"
          >
            <p className="font-semibold text-white">Follow Us</p>
            <div className="flex justify-center mt-4 gap-4">
              <a
                href="https://www.tiktok.com/@weredadstudios"
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                <FaTiktok className="w-7 h-7 text-white" />
              </a>
              <a
                href="https://www.instagram.com/weredadstudios"
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram className="w-7 h-7 text-white" />
              </a>
            </div>
          </motion.div>
        </aside>

        {/* ---------------- LEFT COLUMN (CONTENT) ---------------- */}
        <div className="flex-1 max-w-3xl order-2 lg:order-1">

          {/* Title */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center mb-4"
          >
            <h1 className="text-heading text-white">Project Osiris</h1>
            <span className="ml-auto px-3 py-1 text-sm rounded bg-[#F94C10] text-white">
              Novel
            </span>
          </motion.div>

          {/* Cover */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm shadow-xl group"
          >
            <Image
              src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045758/IMG_1239_ha8hk3.jpg"
              alt="Project Osiris Cover"
              width={600}
              height={400}
              className="w-full h-[420px] object-cover group-hover:scale-[1.04] transition-transform duration-500"
            />
          </motion.div>

          {/* Genres */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-6"
          >
            <p className="text-subheading text-neutral_400 mb-2">Genres</p>
            <div className="flex gap-2 flex-wrap">
              {["Science Fantasy", "Supernatural Thriller", "Dystopian"].map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs font-semibold bg-white/10 text-white rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Description (full text preserved) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8"
          >
            <h2 className="text-subheading text-neutral_400 mb-1">Description</h2>

            {/* Mobile collapsible */}
            <details className="lg:hidden text-neutral_300 mt-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
              <summary className="cursor-pointer text-white font-semibold">
                Tap to read
              </summary>
              <p className="mt-3 text-lg leading-relaxed">
                In the near future, death has become negotiable—but only for the
                wealthy. Thanks to Osiris Inc., the world’s first soul-retrieval
                company, anyone can be brought back—as long as their Time of Death
                hasn’t exceeded 48 hours.
                <br /><br />
                Walkers, elite operatives trained to extract souls within a dangerous
                liminal realm called the Light, maintain this impossible industry.
                But missions are failing. Teams are disappearing.
                <br /><br />
                When seventeen-year-old Vania Illia becomes the sole survivor of a
                catastrophic retrieval mission, she is reassigned to Team Zero—an
                outcast squad no one expects to succeed. But Vania knows what she saw
                in the Light… and it is getting stronger.
              </p>
            </details>

            {/* Desktop full version */}
            <p className="hidden lg:block text-lg leading-relaxed text-neutral_300 mt-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
              In the near future, death has become negotiable—but only for the
              wealthy. Thanks to Osiris Inc., the world’s first soul-retrieval
              company, anyone can be brought back—as long as their Time of Death
              hasn’t exceeded 48 hours.
              <br /><br />
              Walkers, elite operatives trained to extract souls within a dangerous
              liminal realm called the Light, maintain this impossible industry.
              But missions are failing. Teams are disappearing.
              <br /><br />
              When seventeen-year-old Vania Illia becomes the sole survivor of a
              catastrophic retrieval mission, she is reassigned to Team Zero—an
              outcast squad no one expects to succeed. But Vania knows what she saw
              in the Light… and it is getting stronger.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ---------------- RELATED POSTS ---------------- */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16"
      >
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
              <p className="text-neutral_300 text-lg font-medium">No related posts yet.</p>
              <p className="text-neutral_500 text-sm mt-1">More updates are coming soon.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Related Card ---------------- */
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
      className="group bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden hover:bg-white/10 transition shadow-lg"
    >
      <div className="aspect-video relative">
        <Image
          src="/images/WDS LOGO WHITE.png"
          alt={title}
          fill
          className="object-contain p-6 opacity-70 group-hover:opacity-100 transition"
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

export const Main = OsirisContent;
