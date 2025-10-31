"use client";
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { MenuIcon, TwitterIcon, YoutubeIcon } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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
      if (Boolean(JSON.parse(state || "{}").hasVisited)|| path !== "/") {
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
            <Link href={"/about-us"}>
            About Us</Link>
        </div>
    
        <HamburgerMenu />
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
const HamburgerMenu = ()=>{
    const path=usePathname();
  return(
    <Popover>
      <PopoverTrigger className='w-max mx-auto grid place-items-center h-max p-1.5 lg:hidden bg-primary-0 text-white rounded-md'>
        <MenuIcon className='w-5 h-5 '/>
      </PopoverTrigger>
      <PopoverContent className='flex flex-col items-start gap-y-4 p-4 bg-neutral-900 border-primary-0 text-white rounded-lg'>
      
            <Link href={"/projects"} className={path=== "/projects"?"text-neutral-500":""}>
            Projects</Link>
            <Link href={"/blog"} className={path=== "/projects"?"text-neutral-500":""}>
            Blog</Link>
            <Link href={"/about-us"}>
            About Us</Link>
      </PopoverContent>
    </Popover>
  )
}