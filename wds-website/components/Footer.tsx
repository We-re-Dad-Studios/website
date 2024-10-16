import { InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react"
import Image from "next/image"

export const Footer = () => {
  return (
    <footer className="w-[98%] pt-6 pb-12 bg-primary-0 mt-6  mx-auto rounded-t-lg flex flex-col items-center">
     <Image className='lg:w-80 md:w-40 w-32 outline  h-40  object-cover mx-auto' alt='WDS Logo' src={"/images/WDS LOGO WHITE.png"} width={1000} height={1000}/>
     <div  className=" w-full text-[14px] text-center bg-neutral_900/90 py-4 border-t-2 border-b-2 border-t-neutral-600 border-b-neutral-600 flex items-center justify-center gap-x-[5%]">
    <p>Home</p>
    <p>Projects</p>
    <p>About Us</p>
   </div>
     <p className="mt-6 text-center text-[20px]">Follow Us</p>
   <div className="flex w-full items-center mt-4 justify-center gap-x-[5%]">
   <a href="" className="" >
        <InstagramIcon className="w-6 h-6 shrink"/>
    </a>
   <a href="" >
        <TwitterIcon className="w-6 h-6 shrink"/>
    </a>
   <a href="" >
        <YoutubeIcon className="w-6 h-6 shrink"/>
    </a>
   </div>
    </footer>
  )
}
