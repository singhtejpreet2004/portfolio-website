export interface Profile {
  name: string;
  title: string;
  taglines: string[];
  bio: string[];
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
  funFacts: FunFact[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  handle: string;
}

export interface FunFact {
  icon: string;
  label: string;
  value: string | number;
  isCounter: boolean;
}

export interface Skill {
  name: string;
  icon: string;
  proficiency: number;
  yearsOfExperience: number;
  category: string;
}

export interface SkillCategory {
  name: string;
  color: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  bullets: string[];
  keyAchievement: string;
  techStack: string[];
  logoUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  techStack: string[];
  metrics: string;
  thumbnailUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  date: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework: string[];
  activities: string[];
  logoUrl?: string;
}

export interface Achievement {
  title: string;
  type: 'certification' | 'award' | 'accomplishment';
  issuer: string;
  date: string;
  description: string;
  badgeColor: string;
  verificationUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Section = 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements' | 'contact';
