"use client";
import { withFadeIn } from "@/utils/withFadeIn";
import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Comments } from "./Comments";

const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <p className="mb-6 last:mb-0">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (node, children) => {
      return <h1 className="text-3xl font-bold text-amber-300 mt-12 mb-6">{children}</h1>;
    },
    [BLOCKS.HEADING_2]: (node, children) => {
      return <h2 className="text-2xl font-bold text-amber-300 mt-10 mb-5">{children}</h2>;
    },
    [BLOCKS.HEADING_3]: (node, children) => {
      return <h3 className="text-xl font-bold text-amber-300 mt-8 mb-4">{children}</h3>;
    },
    [BLOCKS.UL_LIST]: (node, children) => {
      return <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>;
    },
    [BLOCKS.OL_LIST]: (node, children) => {
      return <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>;
    },
    [BLOCKS.LIST_ITEM]: (node, children) => {
      return <li className="pl-2">{children}</li>;
    },
    [BLOCKS.QUOTE]: (node, children) => {
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
export const Content = withFadeIn(({content,chapter,previousChapter,nextChapter}:{content:Document,chapter:Chapter,previousChapter?:string,nextChapter?:string})=>
    <ChapterReader chapter={chapter} content={content} prevChapter={previousChapter} nextChapter={nextChapter}/>

)
interface extendedWindow extends Window {
    scrollTimer: NodeJS.Timeout | number|null;
}
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type Theme = 'dark' | 'sepia' | 'light';
export interface Chapter {
    id: string;
    title: string;
    chapterNumber: number;
    releaseDate: string;
    content?: Document;
    isFree?: boolean;
    slug: string;
  }
  
//   interface Novel {
//     id: string;
//     title: string;
//     slug: string;
//     totalChapters?: number;
//   }
  interface ChapterReaderProps {
    chapter: Chapter;
    content: Document;
    nextChapter?: string | null;
    prevChapter?: string | null;
  }
  function ChapterReader({ 
    chapter, 
    content,
    nextChapter,
    prevChapter,
  }: ChapterReaderProps) {
    const [fontSize, setFontSize] = useState<"sm"|"md"|"lg"|"xl">('md');
    const [theme, setTheme] = useState('dark');
    const [isScrolling, setIsScrolling] = useState(false);
    const {slug:Novel}=useParams();
    const router = useRouter();
    // Track reading progress
    useEffect(() => {
      if(typeof window !== 'undefined') {
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout((window as unknown as  extendedWindow).scrollTimer as unknown as number);
            (window as unknown as extendedWindow).scrollTimer = setTimeout(() => setIsScrolling(false), 1000);
            
            // Calculate reading progress
            // const progress = Math.round(
            //   (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            // );
            // // You could save this to user's progress tracking
          };
      
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
      }
    }, []);
  
    const fontSizes:Record<string,string> = {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl'
    };
  
    const themes: Record<Theme, string> = {
        dark: 'bg-gray-900 text-gray-100',
        sepia: 'bg-amber-50 text-gray-800',
        light: 'bg-white text-gray-900'
      };
    
    //   const formatDate = (dateString: string): string => {
    //     return new Date(dateString).toLocaleDateString('en-US', { 
    //       year: 'numeric', 
    //       month: 'long', 
    //       day: 'numeric' 
    //     });
    //   };
  
    return (
      <div className={`min-h-screen ${themes[theme as Theme]} transition-colors duration-300 mb-12`}>
        {/* Floating Header */}
        <header className={`fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4 transition-opacity duration-300 ${isScrolling ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
          <div className="container mx-auto flex justify-between items-center">
            <button 
              onClick={() => router.push(`/projects/${Novel}`)}
              className="flex items-center text-amber-400 hover:text-amber-300"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {Novel}
            </button>
            
            <div className="flex space-x-4">
              <select 
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
                className="bg-gray-800 text-amber-100 border border-gray-700 rounded px-2 py-1 text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
              
              <div className="flex space-x-1 bg-gray-800 p-1 rounded">
                {Object.keys(themes).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-6 h-6 rounded-full ${t === 'dark' ? 'bg-gray-700' : t === 'sepia' ? 'bg-amber-300' : 'bg-white'} ${theme === t ? 'ring-2 ring-amber-400' : ''}`}
                    aria-label={`${t} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>
  
        {/* Chapter Content */}
        <div className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
          <div className="mb-12 text-center border-b border-gray-700 pb-8">
            <h1 className="text-4xl font-bold text-amber-400 mb-2 font-mono">{`${Novel[0].toUpperCase()}${(Novel as string).replace("_"," ").slice(1,Novel.length)}`}</h1>
            <h2 className="text-2xl text-gray-300 mb-4">Chapter {chapter.chapterNumber}: {chapter.title}</h2>
            <p className="text-gray-400 text-sm">
              Released: {new Date(chapter.releaseDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
  
          <div 
            className={`${fontSizes[fontSize]} leading-relaxed pb-12 text-justify prose prose-invert max-w-none prose-headings:text-amber-300 prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-strong:text-gray-200`}
           
          >
            {documentToReactComponents(content,options)}
            </div>
        </div>
  
        {/* Navigation Footer */}
        <footer className="mb-12 bg-gradient-to-b from-black/90 to-transparent p-4">
          <div className="container mx-auto flex justify-between items-center">
            <button disabled={!prevChapter} onClick={()=>{
              router.push(`/novels/${Novel}/chapters/${prevChapter}`)
            }} className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/90 text-amber-400 rounded-lg border border-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <div className="text-sm text-gray-400">
              {/* {chapter.chapterNumber} / {chapter.totalChapters} */}
            </div>
            
            <button disabled={!nextChapter} onClick={()=>{
              router.push(`/novels/${Novel}/chapters/${nextChapter}`)
            }} className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/90 text-amber-400 rounded-lg border border-gray-700 flex items-center">
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>
       <div className="w-full px-4 mb-32">
       <Comments title={`${Novel}: chapter-${chapter.chapterNumber}`}/>
       </div>
      </div>
    );
  }