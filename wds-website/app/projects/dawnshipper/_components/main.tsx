"use client";

import Image from "next/image";
import Link from "next/link";
import { withFadeIn } from "@/utils/withFadeIn";
import { Entry } from "contentful";
import { Chapter } from "../page";
import { ChapterListComponent } from "../../components/chapter-list-component";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { motion } from "framer-motion";
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
      {/* -------------- MOBILE STICKY CTA -------------- */}
      <Link
        href="#chapters"
        className="lg:hidden fixed bottom-4 right-4 bg-primary-0 text-black px-5 py-3 rounded-full font-semibold shadow-xl z-50 active:scale-95 transition-transform"
      >
        Start Reading
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* -------------- RIGHT SIDEBAR FIRST ON MOBILE -------------- */}
        <aside
          id="chapters"
          className="order-1 lg:order-2 w-full lg:w-[400px] lg:max-w-max max-w-screen-sm flex flex-col gap-10"
        >
          {/* Chapters Box */}
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

            <div className="space-y-2">
              <ChapterListComponent
                chapters={chapters}
                projectSlug="dawnshipper"
              />
            </div>
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

        {/* -------------- LEFT COLUMN (Content second on mobile) -------------- */}
        <div className="flex-1 max-w-3xl order-2 lg:order-1">
          {/* Title Row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center mb-4"
          >
            <h1 className="text-heading text-white hover:text-primary-0 transition">
              Dawnshipper
            </h1>

            <span className="ml-auto px-3 py-1 text-sm rounded bg-[#F94C10] text-white">
              Novel
            </span>
          </motion.div>
          <Link
            href={`/novels/dawnshipper/chapters/${chapters[0].slug}`}
            className="block w-max px-4 bg-primary-0 text-white font-bold text-center py-4 rounded-xl 
             hover:scale-[1.02] transition shadow-lg mb-6"
          >
            📖 Start Chapter 1 It&apos;s Free
          </Link>

          {/* Cover Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden group shadow-xl"
          >
            <Image
              src="https://res.cloudinary.com/duorxojmh/image/upload/v1765045757/IMG_1190_1_hkbii6.jpg"
              width={800}
              height={500}
              alt="Dawnshipper cover"
              className="w-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
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
          </motion.div>

          {/* Description – collapsible on mobile */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8"
          >
            <h2 className="text-subheading text-neutral_400 mb-1">
              Description
            </h2>

            {/* Mobile collapsible */}
            <details className="lg:hidden text-neutral_300 mt-3">
              <summary className="cursor-pointer text-white font-semibold">
                Tap to read
              </summary>
              <p className="mt-3 text-lg leading-loose text-neutral_300">
                In the world of Thaloria, power is everything. Humans wield
                elemental magic by forming connections with Echoes—semi-sentient
                conduits of energy. The alliance between the powers teeters on
                collapse, as political tensions edge toward civil war. <br />{" "}
                <br /> Devvyn, a stubborn lowborn troublemaker, forms an
                impossible bond with Flux—the Echo of Chaos—granting him magic
                that breaks the rules of the world. As new threats move across
                the continent, Devvyn must uncover the truth behind his
                family&apos;s legacy... or become the spark that ignites
                Thaloria&apos;s downfall.
              </p>
            </details>

            {/* Desktop full text */}
            <p className="hidden lg:block text-lg leading-loose text-neutral_300 mt-3">
              In the world of Thaloria, power is everything. Humans wield
                elemental magic by forming connections with Echoes—semi-sentient
                conduits of energy. The alliance between the powers teeters on
                collapse, as political tensions edge toward civil war. <br />{" "}
                <br /> Devvyn, a stubborn lowborn troublemaker, forms an
                impossible bond with Flux—the Echo of Chaos—granting him magic
                that breaks the rules of the world. As new threats move across
                the continent, Devvyn must uncover the truth behind his
                family&apos;s legacy... or become the spark that ignites
                Thaloria&apos;s downfall.
            </p>
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">
                Chapter 1 Preview
              </h3>
              <p className="text-neutral_300 leading-relaxed">
                {chapters[0].previewText}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Why You'll Love Dawnshipper */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-12 bg-white/5 w-max border border-white/10 rounded-xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-subheading text-white mb-4">
          Why Readers Love Dawnshipper
        </h2>

        <ul className="space-y-3 text-neutral_300 text-lg leading-relaxed">
          <li>
            A grounded yet powerful magic system shaped by elemental Echoes
          </li>
          <li>
             An academy arc filled with ambition, rivalry, and brutal trials
          </li>
          <li>A continent on the edge of civil war</li>
          <li>Antagonists with real motives — not filler villains</li>
          <li>
             A story that rewards careful reading, theory-crafting, and
            immersion
          </li>
        </ul>
      </motion.div>

      {/* -------------- RELATED POSTS -------------- */}
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
              <p className="text-neutral_300 text-lg font-medium">
                No related posts yet.
              </p>
              <p className="text-neutral_500 text-sm mt-1">
                More updates are coming soon.
              </p>
            </div>
          )}
        </div>
      </motion.div>
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

export const Main = withFadeIn(MainContent);
