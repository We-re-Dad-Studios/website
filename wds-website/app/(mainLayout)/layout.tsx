import dynamic from 'next/dynamic';
import { Footer } from '@/components/Footer';
import { EchoTransition } from '@/components/page-transition';
import React from 'react'

const EchoParticles = dynamic(() =>
  import('@/components/echo-particles').then((mod) => mod.EchoParticles)
);

export default  function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
  return (
    <div className='flex flex-col'>
       <EchoParticles />
        <EchoTransition>{children}</EchoTransition>
       <Footer/> 
    </div>
  )
}
