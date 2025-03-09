"use client"
import { withFadeIn } from "@/utils/withFadeIn"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from "@contentful/rich-text-types";
const Content = ({content}:{content:string}) => {
  return (
    <div className="my-8 w-full leading-[30px] lg:px-0 px-2  lg:w-[80%] mx-auto">
        {documentToReactComponents(content as unknown as Document)}

    </div>
  )
}

export const FadedContent= withFadeIn(({content}:{content:string})=>(
        <Content content={content}/>
    ));

