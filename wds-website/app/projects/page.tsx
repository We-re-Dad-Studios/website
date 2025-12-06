// app/projects/page.tsx
import { createClient, Entry, EntrySkeletonType } from "contentful";
import { ProjectPageinator } from "./components/ProjectPageinator";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_CDAPI!,
  });

  const [projectsResponse, tagsResponse] = await Promise.all([
    client.getEntries({
      content_type: process.env.PROJECTS_ID!,
      limit: 1000,
    }),
    client.getEntries({
      content_type: process.env.TAGS_ID!,
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
  console.log({projects,tags})

  return (
    <section className="w-full min-h-screen flex flex-col">
      <ProjectPageinator initialProjects={projects} tags={tags} />
    </section>
  );
}
