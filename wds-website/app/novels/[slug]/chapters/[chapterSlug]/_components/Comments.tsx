import { DiscussionEmbed } from 'disqus-react';
import { useParams } from 'next/navigation';

export const Comments=({title}:{title:string})=>{
    const {slug,chapterSlug}=useParams();
    return(
        <DiscussionEmbed shortname='weredadstudios'  config={{
            url: `https://weredadstudios.com/novels/${slug}/chapters/${chapterSlug}`,
            identifier: `${slug}/${chapterSlug}`, // Replace with your unique identifier for the chapter
            title: `${title}`,
            language:"en" // Replace with the title of the chapter
        }}/>
    )
}