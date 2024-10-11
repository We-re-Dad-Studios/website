import React from 'react'

export const Newsletter = () => {
  return (
    <div className='w-full md:w-[80vw] mx-auto rounded-lg flex mb-12 overflow-hidden px-2'>
     
     <div className='ml-auto h-[50vh] bg-primary-100 w-max lg:px-0 max-w-[70%] lg:w-[30%] flex flex-col justify-center items-center'>
        <p className='bg-[#F21170] px-2 lg:px-4 py-2 rounded-lg border-[2px] border-black text-[18px] whitespace-nowrap lg:text-[28px]'>JOIN THE ADVENTURE - SUBSCRIBE NOW!</p>
        <p className='w-[90%] lg:w-[70%] text-center text-neutral_900 lg:text-[18px] text-[14px] mt-4'>Be the first to know about our latest releases, exclusive content, and behind-the-scenes updates. just for you. Subscribe today and never miss out!</p>
     </div>
     </div>
  )
}
