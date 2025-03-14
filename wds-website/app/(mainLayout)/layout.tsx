import { Footer } from '@/components/Footer';
import React from 'react'

export default  function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
  return (
    <div className='flex flex-col'>
       {children}
       <Footer/> 
    </div>
  )
}
