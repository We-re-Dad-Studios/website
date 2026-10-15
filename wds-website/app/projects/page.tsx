// app/projects/page.tsx
import { Metadata } from "next";
import { Entry, EntrySkeletonType } from "contentful";
import { ProjectPageinator } from "./components/ProjectPageinator";
import {
  createContentfulClient,
  getProjectContentTypeId,
  getTagContentTypeId,
} from "@/lib/contentful";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects | We're Dad Studios",
  description:
    "Explore WDS projects — the novels Dawnshipper and Project Osiris, and the games Afterlives and Stryfe (Hex War).",
  openGraph: {
    title: "Projects | We're Dad Studios",
    description:
      "Explore WDS projects — the novels Dawnshipper and Project Osiris, and the games Afterlives and Stryfe (Hex War).",
    url: "https://weredadstudios.com/projects",
  },
  alternates: { canonical: "https://weredadstudios.com/projects" },
};

// Games live in code until they get Contentful `project` entries; shaped like
// entries so the grid treats them the same (internal route, no image yet).
const GAME_PROJECTS = [
  {
    id: "game-afterlives",
    name: "Afterlives",
    description:
      "Poisoned and denied his place among the dead, the warrior Odi fights through the afterlives of other peoples to reach the Resurrection Stone. A mythic action game in development.",
    to: "/projects/afterlives",
  },
  {
    id: "game-stryfe",
    name: "Stryfe (Hex War)",
    description:
      "A 5v5 team arena game in Arcanis, where magic is infrastructure and two nations war over the Hexnodes that power everything. In development.",
    to: "/projects/stryfe",
  },
].map(
  (g) =>
    ({
      sys: { id: g.id },
      fields: { name: g.name, description: g.description, useInternalRoute: true, to: g.to, tags: [] },
    }) as unknown as Entry<EntrySkeletonType, undefined, string>
);

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

  const projects = [
    ...(projectsResponse.items as Entry<EntrySkeletonType, undefined, string>[]),
    ...GAME_PROJECTS,
  ];
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
