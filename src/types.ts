export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content?: string;
  imageUrl: string;
  createdAt?: any;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl?: string;
  repoUrl?: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  telegram?: string;
}

export interface Experience {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
}

export interface ProfileData {
  bio: string;
  role: string;
  avatarUrl?: string;
  resumeUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: Skill[];
  socialLinks?: SocialLinks;
  experience?: Experience[];
  hero?: HeroSection;
}

export type PageRoute = 'home' | 'blog' | 'about' | 'projects' | 'contact';

export type NavigateFunction = (page: PageRoute, id?: string) => void;
