// app/projects/page.tsx
import { Entry, EntrySkeletonType } from "contentful";
import { ProjectPageinator } from "./components/ProjectPageinator";
import {
  createContentfulClient,
  getProjectContentTypeId,
  getTagContentTypeId,
} from "@/lib/contentful";

export const revalidate = 60;

export default async function ProjectsPage() {
  const client = createContentfulClient();

  const [projectsResponse, tagsResponse] = await Promise.all([
    client.getEntries({
      content_type: getProjectContentTypeId(),
      limit: 1000,
    }),
    client.getEntries({
      content_type: getTagContentTypeId(),
      limit: 1000,
    }),
  ]);

  const projects = projectsResponse.items as Entry<
    EntrySkeletonType,
    undefined,
    string
  >[];
  const tags = tagsResponse.items as Entry<
    EntrySkeletonType,
    undefined,
    string
  >[];
  // console.log({projects,tags})

  return (
    <section className="w-full min-h-screen flex flex-col">
      <ProjectPageinator initialProjects={projects} tags={tags} />
    </section>
  );
}
