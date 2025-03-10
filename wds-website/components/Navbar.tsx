"use client";
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { TwitterIcon, YoutubeIcon } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const Navbar = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const path=usePathname();
  const { getItem } = useSessionStorage();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    if (isClient) {
      const state = getItem("state");
      if (Boolean(JSON.parse(state || "{}").hasVisited)) {
        setShow(true);
      }
    }
  });
  if (!show) return <></>;
  return (
    <nav className='w-full bg-base_black flex items-center justify-between px-2 md:px-[80px] h-[80px] py-2'>
        <Link href={"/"}>
        <Image src={"/images/WDS LOGO WHITE.png"} className="w-24 object-cover h-full " width={1000} height={1000} alt='wds logo'/>
        </Link>
  
       <div className="w-max font-agdasima rounded-lg overflow-hidden h-max py-1.5 px-4 nav-main gap-x-14 text-[18px] bg-neutral-900  items-center md:flex hidden  [&>*:hover]:drop-shadow-[0_10px_10px_rgba(255,255,255,1)] [&>*:hover]:text-[20px] [&>*]:hover:duration-75 hover:gap-x-24 transition-[column-gap]  bounce">
            <Link href={"/"}  className={path=== "/"?"text-neutral-500":""}>
            Home</Link>
            <Link href={"/projects"} className={path=== "/projects"?"text-neutral-500":""}>
            Projects</Link>
            <Link href={"/blog"} className={path=== "/projects"?"text-neutral-500":""}>
            Blog</Link>
            <Link href={"/"}>
            About Us</Link>
        </div>


        <div className="flex items-center gap-x-5  text-neutral-500">
       <a className='cursor-pointer'>
       <YoutubeIcon />
       </a>
       <a className='cursor-pointer'>
       <TwitterIcon/>
       </a>
        
        </div>
    </nav>
  )
}
