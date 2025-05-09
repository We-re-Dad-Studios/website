"use client"
import { withFadeIn } from "@/utils/withFadeIn"
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { ReactNode } from "react";
const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => {
      return <p className="mb-6 text-xl last:mb-0">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (_node, children) => {
      return <h1 className="text-4xl font-bold  mt-12 mb-6">{children}</h1>;
    },
    [BLOCKS.HEADING_2]: (_node, children) => {
      return <h2 className="text-3xl font-bold  mt-10 mb-5">{children}</h2>;
    },
    [BLOCKS.HEADING_3]: (_node, children) => {
      return <h3 className="text-2xl font-bold  mt-8 mb-4">{children}</h3>;
    },
    [BLOCKS.UL_LIST]: (_node, children) => {
      return <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>;
    },
    [BLOCKS.OL_LIST]: (_node, children) => {
      return <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>;
    },
    [BLOCKS.LIST_ITEM]: (_node, children) => {
      return <li className="pl-2">{children}</li>;
    },
    [BLOCKS.QUOTE]: (_node, children) => {
      return (
        <blockquote className="border-l-4 border-amber-500 pl-4 my-6 italic text-gray-300">
          {children}
        </blockquote>
      );
    },
    [BLOCKS.HR]: () => {
      return <hr className="my-8 border-gray-700" />;
    },
  },
  renderText: (text) => {
    return text.split('\n').reduce((children: ReactNode[], textSegment, index) => {
      return [...children, index > 0 && <br key={index} />, textSegment];
    }, []);
  },
};
const Content = ({content,title}:{content:string,title:string}) => {
  return (
    <div className="my-8 w-full leading-[50px] lg:px-0   text-neutral-400   lg:w-[80%] mx-auto bg-white/10 backdrop-blur-sm p-2 px-4">
     <div className="w-[90%] mx-auto"> <p className="text-3xl  mb-4 mt-2 font-bold tracking-wider text-center ">
        {title}
      </p>
        {documentToReactComponents(content as unknown as Document,options)}</div>

    </div>
  )
}

export const FadedContent= withFadeIn(({content,title}:{content:string,title:string})=>(
        <Content content={content} title={title}/>
    ));

