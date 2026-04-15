import { fetchResume } from "@/lib/api";
import { Resume } from "@/lib/types";
import AboutSection from "@/components/resume/AboutSection";
import ExperienceSection from "@/components/resume/ExperienceSection";
import SkillsSection from "@/components/resume/SkillsSection";
import EducationSection from "@/components/resume/EducationSection";
import ChatPanel from "@/components/chat/ChatPanel";
import ChatStatsBadge from "@/components/ChatStatsBadge";
import SkillsRadar from "@/components/visualizations/SkillsRadar";
import CareerTimeline from "@/components/visualizations/CareerTimeline";
import TechWordCloud from "@/components/visualizations/TechWordCloud";
import HomeLayout from "@/components/HomeLayout";

export const revalidate = 3600;

async function getResume(): Promise<Resume | null> {
  try {
    return await fetchResume();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const resume = await getResume();

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="font-medium">Could not load resume data.</p>
          <p className="text-sm mt-1">Make sure the backend API is running at localhost:8000</p>
        </div>
      </div>
    );
  }

  const otherTags = [
    ...resume.skills.frontend,
    ...resume.skills.backend,
    ...resume.skills.devops_cloud.slice(0, 6),
    ...resume.skills.ai_ml.slice(0, 4),
  ];

  const resumePanel = (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <AboutSection personal={resume.personal} availability={resume.availability} />
      <div className="mb-4 -mt-4">
        <ChatStatsBadge />
      </div>

      {/* Visualizations */}
      <div className="mb-8 space-y-4">
        <SkillsRadar data={resume.skills.skill_radar} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CareerTimeline experience={resume.experience} education={resume.education} />
          <TechWordCloud languages={resume.skills.languages} otherTags={otherTags} />
        </div>
      </div>

      <ExperienceSection experience={resume.experience} />
      <SkillsSection skills={resume.skills} />
      <EducationSection
        education={resume.education}
        certifications={resume.certifications}
      />
    </div>
  );

  return <HomeLayout resumePanel={resumePanel} chatPanel={<ChatPanel />} />;
}
