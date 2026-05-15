"use client";
// import { TwitterIcon, YoutubeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTiktok } from "react-icons/fa6";

export const Footer = () => {
  const path = usePathname();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    let hasVisited = false;

    try {
      hasVisited = Boolean(JSON.parse(sessionStorage.getItem("state") || "{}").hasVisited);
    } catch {
      hasVisited = false;
    }

    setShow(hasVisited || path !== "/");
  }, [path]);

  if (!show) return <></>;
  return (
    <footer className="w-[98%] pt-6 pb-12 bg-primary-0 mt-6  mx-auto rounded-t-lg flex flex-col items-center">
      <Image
        className="lg:w-80 md:w-40 w-32 outline  h-40  object-cover mx-auto"
        alt="WDS Logo"
        src={"/images/WDS LOGO WHITE.png"}
        width={1000}
        height={1000}
      />
      <div className="w-full text-[14px] text-white text-center bg-black/20 dark:bg-neutral_900/90 py-4 border-t-2 border-b-2 border-t-white/20 border-b-white/20 flex items-center justify-center gap-x-[5%]">
        <Link href={"/"}>Home</Link>
        <Link href={"/projects"}>Projects</Link>
        <Link href={"/about-us"}>About Us</Link>
      </div>
      <p className="mt-6 text-white text-center text-[20px]">Follow Us</p>
      <div className="flex w-full items-center mt-4 justify-center gap-x-[5%]">

        <a href="https://www.tiktok.com/@weredadstudios" target="_blank" rel="noopener noreferrer" className="">
          <FaTiktok  className="w-6 h-6 shrink text-white" />
        </a>
        {/* <a href="">
          <TwitterIcon className="w-6 h-6 shrink" />
        </a> */}
        {/* <a href="">
          <YoutubeIcon className="w-6 h-6 shrink" />
        </a> */}
      </div>
    </footer>
  );
};
