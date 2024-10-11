"use client";
import { TwitterIcon, YoutubeIcon } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export const Navbar = () => {
const path=usePathname();
  return (
    <nav className='w-full bg-base_black flex items-center justify-between px-2 md:px-[80px] h-[80px] py-2'>
        <Link href={"/"}>
        <Image src={"/images/WDS LOGO WHITE.png"} className="w-24 object-cover h-full " width={1000} height={1000} alt='wds logo'/>
        </Link>
  
       <div className="w-max  rounded-lg overflow-hidden h-max py-1.5 px-4 nav-main gap-x-6 text-[18px] bg-neutral-900  items-center md:flex hidden">
            <Link href={"/"}  className={path=== "/"?"text-neutral-500":""}>
            Home</Link>
            <Link href={"/projects"}>
            Projects</Link>
            <Link href={"/about-us"}>
            About Us</Link>
        </div>


        <div className="flex items-center gap-x-2  text-neutral-500">
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
