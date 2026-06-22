"use client";

import { ExternalLink, Search } from "lucide-react";

interface JobSearch {
  title: string;
  keywords: string;
  description: string;
  seek: string;
  indeed: string;
  linkedin: string;
}

const LOCATION_INDEED = "Brisbane%2C+QLD";
const LOCATION_LINKEDIN = "Australia";

function seekUrl(keywords: string) {
  return `https://www.seek.com.au/jobs?keywords=${encodeURIComponent(keywords)}&where=Brisbane+QLD`;
}

function indeedUrl(keywords: string) {
  return `https://au.indeed.com/jobs?q=${encodeURIComponent(keywords)}&l=${LOCATION_INDEED}`;
}

function linkedinUrl(keywords: string) {
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${LOCATION_LINKEDIN}&f_WT=2`;
}

const JOB_GROUPS: { category: string; jobs: JobSearch[] }[] = [
  {
    category: "AI Engineering",
    jobs: [
      {
        title: "AI Engineer",
        keywords: "AI Engineer",
        description: "LLM integration, RAG pipelines, AI product development",
        seek: seekUrl("AI Engineer"),
        indeed: indeedUrl("AI Engineer"),
        linkedin: linkedinUrl("AI Engineer"),
      },
      {
        title: "LLM Engineer",
        keywords: "LLM Engineer",
        description: "Large language model fine-tuning, prompt engineering, inference",
        seek: seekUrl("LLM Engineer"),
        indeed: indeedUrl("LLM Engineer"),
        linkedin: linkedinUrl("LLM Engineer"),
      },
      {
        title: "AI Full Stack Engineer",
        keywords: "AI Full Stack Engineer",
        description: "End-to-end AI product engineering with frontend + backend",
        seek: seekUrl("AI Full Stack Engineer"),
        indeed: indeedUrl("AI Full Stack Engineer"),
        linkedin: linkedinUrl("AI Full Stack Engineer"),
      },
      {
        title: "Machine Learning Engineer",
        keywords: "Machine Learning Engineer",
        description: "ML pipelines, model deployment, MLOps",
        seek: seekUrl("Machine Learning Engineer"),
        indeed: indeedUrl("Machine Learning Engineer"),
        linkedin: linkedinUrl("Machine Learning Engineer"),
      },
    ],
  },
  {
    category: "Full Stack / Backend",
    jobs: [
      {
        title: "Full Stack Engineer",
        keywords: "Full Stack Engineer Python React",
        description: "Python + React/Next.js, REST APIs, cloud-native",
        seek: seekUrl("Full Stack Engineer"),
        indeed: indeedUrl("Full Stack Engineer Python"),
        linkedin: linkedinUrl("Full Stack Engineer Python"),
      },
      {
        title: "Python Developer",
        keywords: "Python Developer FastAPI",
        description: "Backend Python, FastAPI, AWS",
        seek: seekUrl("Python Developer"),
        indeed: indeedUrl("Python Developer"),
        linkedin: linkedinUrl("Python Developer"),
      },
      {
        title: "Senior Software Engineer",
        keywords: "Senior Software Engineer Python AWS",
        description: "Senior IC role, Python/TypeScript, cloud infra",
        seek: seekUrl("Senior Software Engineer"),
        indeed: indeedUrl("Senior Software Engineer"),
        linkedin: linkedinUrl("Senior Software Engineer"),
      },
    ],
  },
  {
    category: "Cloud & DevOps",
    jobs: [
      {
        title: "Cloud Engineer (AWS)",
        keywords: "AWS Cloud Engineer",
        description: "AWS infrastructure, ECS, CloudFormation, CI/CD",
        seek: seekUrl("AWS Cloud Engineer"),
        indeed: indeedUrl("AWS Cloud Engineer"),
        linkedin: linkedinUrl("AWS Cloud Engineer"),
      },
      {
        title: "DevOps Engineer",
        keywords: "DevOps Engineer Docker Kubernetes",
        description: "Docker, K8s, GitHub Actions, cloud automation",
        seek: seekUrl("DevOps Engineer"),
        indeed: indeedUrl("DevOps Engineer"),
        linkedin: linkedinUrl("DevOps Engineer"),
      },
    ],
  },
];

const BOARDS = [
  { key: "seek", label: "Seek" },
  { key: "indeed", label: "Indeed" },
  { key: "linkedin", label: "LinkedIn" },
] as const;

export default function JobsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-display text-ink">Job Search</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          Pre-filled job searches on Seek, Indeed, and LinkedIn — Brisbane · Remote · Hybrid.
        </p>
      </div>

      <div className="space-y-8">
        {JOB_GROUPS.map((group) => (
          <div key={group.category}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">
              {group.category}
            </h2>
            <div className="space-y-3">
              {group.jobs.map((job) => (
                <div key={job.title}
                  className="bg-surface-1 rounded-xl border border-hairline p-4 hover:bg-surface-2">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Search className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                        <span className="font-semibold text-sm text-ink">{job.title}</span>
                      </div>
                      <p className="text-xs text-ink-subtle ml-5">{job.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {BOARDS.map((board) => (
                        <a
                          key={board.key}
                          href={job[board.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all bg-surface-2 border border-hairline text-ink-muted hover:bg-surface-3 hover:text-ink"
                        >
                          {board.label}
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
