"use client";
import Image from 'next/image'
import  { useEffect,useState } from 'react'
import { SendEmail } from './SendEmail'
import { usePathname } from 'next/navigation';

export const Newsletter = () => {
  const [isClient,setIsClient] = useState<boolean>(false);
  useEffect(()=>{
    setIsClient(true);
  })
  const state =isClient?sessionStorage?.getItem("state")||null:null;
  const path = usePathname();
  if(path === "/" && !state) return <></>
  return (
    <div className='w-full xl:w-[80vw] mx-auto rounded-lg flex mb-12 overflow-hidden px-2'>
     <div className="flex-1  rounded-l-lg flex relative bg-black">
     <div className=' place-items-center px-4 border-r-[2px] bg-primary-0  border-r-white news-1  absolute left-0 top-0 z-[10] h-full lg:grid hidden'>
     <Image className='lg:w-40 md:w-32 w-24 aspect-square lg:h-40 my-auto' alt='WDS Logo' src={"/images/WDS LOGO WHITE.png"} width={1000} height={1000}/>
     </div>
    <div className='relative flex-1 lg:block hidden overflow-hidden'>
    <Image alt='devvyn dawnshipper' className='z-[3] news-2 absolute left-[10px] top-0 w-1/2 h-full object-cover object-top' width={1000} height={1000} src={"/images/devvyn.jpg"}/>
     <Image alt='Nera blackthorne' className='z-[2] news-2 absolute left-1/3 top-0 w-1/3 h-full object-cover object-top' width={1000} height={1000} src={"/images/Nera.png"}/>
     <Image alt='Murphy' className='z-[1] news-2 absolute left-1/2 top-0 w-1/3 h-full object-cover object-center' width={1000} height={1000} src={"/images/murph.jpg"}/>
     <Image alt='John Doe' className='z-[0]  absolute right-0 top-0 w-1/3 h-full object-cover object-left' width={1000} height={1000} src={"/images/jd-2.jpg"}/>
    </div>
     </div>
     <div className='ml-auto min-h-[50vh] py-4 h-max bg-primary-100  lg:px-0 md:max-w-[70%] w-full lg:w-[35%] flex flex-col justify-center items-center rounded-r-lg'>
        <p className='bg-[#F21170] px-2 xl:px-4 py-2 rounded-lg border-[2px] border-black text-[16px]  lg:text-[18px]'>JOIN THE ADVENTURE - SUBSCRIBE NOW!</p>
        <p className='w-[90%] lg:w-[70%] text-center text-neutral_900 lg:text-[14px] text-[12px] my-4'>Be the first to know about our latest releases, exclusive content, and behind-the-scenes updates. just for you. Subscribe today and never miss out!</p>
     <SendEmail/>
     </div>
     </div>
  )
}
