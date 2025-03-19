"use client"
import { withFadeIn } from "@/utils/withFadeIn"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from "@contentful/rich-text-types";
const Content = ({content,title}:{content:string,title:string}) => {
  return (
    <div className="my-8 w-full leading-[50px] lg:px-0  text-[20px] text-neutral-400   lg:w-[80%] mx-auto bg-white/10 backdrop-blur-sm p-2 px-4">
     <div className="w-[90%] mx-auto"> <p className="text-3xl  mb-4 mt-2 font-bold tracking-wider text-center">
        {title}
      </p>
        {documentToReactComponents(content as unknown as Document)}</div>

    </div>
  )
}

export const FadedContent= withFadeIn(({content,title}:{content:string,title:string})=>(
        <Content content={content} title={title}/>
    ));

