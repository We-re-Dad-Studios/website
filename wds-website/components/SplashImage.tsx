"use client";
import { animate } from 'framer-motion/dom';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export const SplashImage = () => {
    const imageRef = useRef<HTMLImageElement|null>(null);
    const [hasPageMounted,setHasPageMounted]=useState<boolean>(false);
    const [hasImageLoaded,setHasImageLoaded]= useState<boolean>(true);
    useEffect(()=>{
        if(!hasPageMounted){
            setHasPageMounted(true);
        }
       if(hasPageMounted && hasImageLoaded && imageRef.current !== null){
        animate(imageRef.current!,{
            y:[30,10,-120],
            opacity:[0,0,1],
            scale:[0.8,0.8,1]
        },{duration:0.7,ease:"easeOut",times:[0,0.5,1]});
        setTimeout(() => {
        if(imageRef.current){
            animate(imageRef.current!,{
                scale:[1,1.05,0.95]
            },{ duration: 1.5, // duration of one full cycle
                repeat: Infinity, // repeat forever
                repeatType: "reverse", // to scale down after scaling up
                ease: "easeInOut",}) 
        }
        }, 750);
       }
    },[hasPageMounted,hasImageLoaded])
  return (
    <Image  alt="logo" style={{opacity:0}}  ref={imageRef} onLoad={()=>{
        setHasImageLoaded(true);
    }} className="splash-image absolute drop-shadow-md max-w-[95vw] w-[600px]  object-cover" width={2000} height={2000} src={"/images/WDS LOGO WHITE.png"}/>
  )
}
