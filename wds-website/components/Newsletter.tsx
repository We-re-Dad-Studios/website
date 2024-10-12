import Image from 'next/image'
import React from 'react'
import { SendEmail } from './SendEmail'

export const Newsletter = () => {
  return (
    <div className='w-full xl:w-[80vw] mx-auto rounded-lg flex mb-12 overflow-hidden px-2'>
     <div className="flex-1  rounded-l-lg flex relative bg-black">
     <div className='grid place-items-center px-4 border-r-[2px] bg-primary-0  border-r-white news-1  absolute left-0 top-0 z-[10] h-full'>
     <Image className='lg:w-40 md:w-32 w-24 aspect-square lg:h-40 my-auto' alt='WDS Logo' src={"/images/WDS LOGO WHITE.png"} width={1000} height={1000}/>
     </div>
    <div className='relative flex-1 lg:block hidden overflow-hidden'>
    <Image alt='devvyn dawnshipper' className='z-[3] news-2 absolute left-[10px] top-0 w-1/2 h-full object-cover object-top' width={1000} height={1000} src={"/images/devvyn.jpg"}/>
     <Image alt='Nera blackthorne' className='z-[2] news-2 absolute left-1/3 top-0 w-1/3 h-full object-cover object-top' width={1000} height={1000} src={"/images/Nera.png"}/>
     <Image alt='Murphy' className='z-[1] news-2 absolute left-1/2 top-0 w-1/3 h-full object-cover object-center' width={1000} height={1000} src={"/images/murph.jpg"}/>
     <Image alt='John Doe' className='z-[0]  absolute right-0 top-0 w-1/3 h-full object-cover object-left' width={1000} height={1000} src={"/images/jd-2.jpg"}/>
    </div>
     </div>
     <div className='ml-auto min-h-[50vh] py-4 h-max bg-primary-100 w-max lg:px-0 max-w-[70%] lg:w-[35%] flex flex-col justify-center items-center rounded-r-lg'>
        <p className='bg-[#F21170] px-2 xl:px-4 py-2 rounded-lg border-[2px] border-black text-[18px] whitespace-nowrap lg:text-[28px]'>JOIN THE ADVENTURE - SUBSCRIBE NOW!</p>
        <p className='w-[90%] lg:w-[70%] text-center text-neutral_900 lg:text-[18px] text-[14px] mt-4'>Be the first to know about our latest releases, exclusive content, and behind-the-scenes updates. just for you. Subscribe today and never miss out!</p>
     <SendEmail/>
     </div>
     </div>
  )
}
