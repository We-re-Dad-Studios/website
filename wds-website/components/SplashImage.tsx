"use client";
import { animate } from 'framer-motion/dom';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export const SplashImage = () => {
    const imageRef = useRef<HTMLImageElement|null>(null);
    const [hasPageMounted,setHasPageMounted]=useState<boolean>(false)
    useEffect(()=>{
        if(!hasPageMounted){
            setHasPageMounted(true);
        }
       if(hasPageMounted){
        animate(imageRef.current!,{
            y:[30,-25,-120],
            opacity:[0,0,1],
            scale:[0.8,1]
        },{duration:0.4,ease:"easeOut",times:[0,0.5,1]});
        setTimeout(() => {
        animate(imageRef.current!,{
            scale:[1,1.05,0.95]
        },{ duration: 1.5, // duration of one full cycle
            repeat: Infinity, // repeat forever
            repeatType: "reverse", // to scale down after scaling up
            ease: "easeInOut",}) 
        }, 450);
       }
    },[hasPageMounted])
  return (
    <Image  alt="logo" style={{opacity:0}}  ref={imageRef} className="splash-image absolute drop-shadow-md max-w-[80vw] w-[600px]  object-cover" width={2000} height={2000} src={"/images/WDS LOGO WHITE.png"}/>
  )
}
