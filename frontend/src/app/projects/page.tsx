import { fetchProjects } from "@/lib/api";
import { Project, ProjectCategory } from "@/lib/types";
import ProjectCard from "@/components/projects/ProjectCard";

export const revalidate = 3600;

async function getProjects(): Promise<Project[]> {
  try {
    return await fetchProjects();
  } catch {
    return [];
  }
}

// Featured first, then most recent.
function order(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
  );
}

const GROUPS: { category: ProjectCategory; label: string; grid: string; big: boolean }[] = [
  { category: "ai-engineer", label: "AI Engineer Projects", grid: "grid-cols-1", big: true },
  { category: "fullstack", label: "Fullstack Projects", grid: "grid-cols-1", big: true },
  { category: "other", label: "Other Projects", grid: "grid-cols-1 md:grid-cols-3", big: false },
];

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-display text-ink">Projects</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          Things I&apos;ve built — from AI pipelines to government platforms.
        </p>
      </div>

      {GROUPS.map(({ category, label, grid, big }) => {
        const group = order(projects.filter((p) => p.category === category));
        if (group.length === 0) return null;
        return (
          <div key={category} className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
              {label}
            </h2>
            <div className={`grid ${grid} gap-4`}>
              {group.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  featured={big && project.featured}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
