import { ProjectCard } from '@/components/ProjectsSection'
import useFetchMockData, { TMockData } from '@/hooks/useFetchMockData'
import { Search, SlidersHorizontalIcon } from 'lucide-react'
import React from 'react'

export const ProjectPageinator = () => {

  const response: TMockData = useFetchMockData(30, 1, 'manga')
 
  
  return (
    <div className='flex flex-col items-center w-full px-16'>
      <div><h1 className='font-bebas text-[40px] py-10'>BROWSE OUR CURATED COLLECTIONS</h1></div>
      <div className=' flex w-full justify-between [&>*]:text-[12px] [&>*]:cursor-pointer pb-10'>
        <div className='flex gap-x-3 [&>*]:bg-white [&>*]:bg-opacity-10 [&>*]:transition-all  [&>*:hover]:scale-110 [&>*]:bounce [&>*:hover]:bg-primary-0 [&>*]:h-max [&>*]:rounded-md  [&>*]:px-5 [&>*]:py-2'>
          <div>Games</div>
          <div className='bg-primary-0'>Manga</div>
          <div>Novels</div>
          <div>Manwha</div>
          <div>Animations</div>
        </div>
        <div className='flex gap-4 [&>*]:flex [&>*]:gap-x-3 [&>*]:items-center [&>*]:bg-white [&>*]:rounded-md [&>*]:bg-opacity-10 [&>*]:px-3'>
          <div className='bg'>
            <Search />
            <input type="text" name="" id="" className='bg-transparent outline-transparent' />
          </div>
          <div>
            <SlidersHorizontalIcon />
            <p>Filter</p>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-6 justify-center'>
      {
                  !response.loading ? response.data.items.map((project:any)=>project.description != '' && <ProjectCard key={project.name} {...project} type='Manga' />) : <h1>Loading</h1>
                }
      </div>
      <div className='flex gap-5 items-center [&>*]:text-[12px] [&>*]:cursor-pointer py-10'>
        <div className='text-gray-600'>Prev</div>
        <div className='flex gap-3 [&>*]:px-4 [&>*]:py-2 [&>*]:transition-all [&>*:hover]:bg-primary-0  [&>*]:bg-white [&>*]:bg-opacity-10 [&>*]:rounded-md [&>*]:border [&>*]:border-gray-700 '>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        </div>
        <div>Next</div>
        </div>
    </div>
  )
}

