import { fetchProjects } from "@/lib/api";
import { Project } from "@/lib/types";
import ProjectCard from "@/components/projects/ProjectCard";

export const revalidate = 3600;

async function getProjects(): Promise<Project[]> {
  try {
    return await fetchProjects();
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Things I&apos;ve built — from AI pipelines to government platforms.
        </p>
      </div>

      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            Featured
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} featured />
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            Other Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {other.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
