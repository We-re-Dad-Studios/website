import { EchoParticles } from '@/components/echo-particles';
import { Footer } from '@/components/Footer';
import { EchoTransition } from '@/components/page-transition';

import React from 'react'

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
