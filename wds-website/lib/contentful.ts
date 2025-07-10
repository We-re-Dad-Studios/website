import { createClient } from "contentful";
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_CDAPI!,
  });
  

  
  export async function getNovelBySlug(slug:string) {
  
  
    const response = await client.getEntries({
      content_type: 'novel',
      'fields.slug': slug,
      limit: 1,
      include: 0
    });
  
    if (response.items.length === 0) return null;
    
    const novel = response.items[0];
    return novel;
  }
  
  export async function getChapterList(novelId:string) {

  
    const response = await client.getEntries({
      content_type: 'chapter',
      'fields.project.sys.id': novelId,
    //   eslint-disable-next-line @typescript-eslint/no-explicit-any
      order: 'fields.chapterNumber' as any,
      
      limit: 1000,
      include: 0
    });
  
    const chapters = response.items.map(item => ({
      id: item.sys.id,
      ...item.fields
    }));
  
    return chapters;
  }


  
  export async function getChapterContent(chapterId:string) {
    const response = await client.getEntry(chapterId);
    return response.fields.content;
  }
  export async function getChapterBySlug(slug:string) {
    const response = await client.getEntries({
        content_type: 'chapter',
        'fields.slug': slug,
    });
   if(response.items.length === 0) return null;
    const chapter = response.items[0];
    return chapter.fields;
  }

  export async function getChapterByNumber(chapterNumber:number,projectSlug:string){
    const response = await client.getEntries({
      content_type: 'chapter',
      'fields.chapterNumber': chapterNumber,
      'fields.projectSlug': projectSlug,
      limit: 1,
    })
    if(Array.isArray(response.items) && response.items.length > 0){
      return response.items[0].fields;
    }
    return null;
  }