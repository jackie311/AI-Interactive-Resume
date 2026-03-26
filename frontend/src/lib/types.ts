export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  open_to_work: boolean;
  bio: string;
}

export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa?: string;
  highlights: string[];
}

export interface SkillEntry {
  name: string;
  level: number;
  years: number;
}

export interface RadarEntry {
  category: string;
  score: number;
}

export interface Skills {
  languages: SkillEntry[];
  frontend: string[];
  backend: string[];
  databases: string[];
  devops_cloud: string[];
  ai_ml: string[];
  skill_radar: RadarEntry[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

export interface Availability {
  status: string;
  preferred_roles: string[];
  preferred_stack: string[];
  work_arrangement: string[];
  notice_period: string;
}

export interface Resume {
  personal: PersonalInfo;
  experience: Job[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  languages_spoken: string[];
  availability: Availability;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  tech: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  year: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
