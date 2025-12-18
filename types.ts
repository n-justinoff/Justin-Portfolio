export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  mainTag?: string;
  role?: string;
  platform?: string;
  link?: string;
  year: number;
  gallery?: string[];
  fullDescription?: string;
  isRestricted?: boolean;
  heroVideo?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  tagline?: string;
  bio: string;
  heroImage: string;
  heroVideo?: string;
  avatar: string;
  email: string;
  resumeUrl?: string;
  socials: {
    linkedin?: string;
    dribbble?: string;
    twitter?: string;
  };
  availability: {
    status: "available" | "unavailable" | "date";
    date?: string;
  };
}

export const CATEGORIES = [
  "Featured Projects",
  "Concept Designs",
  "Skill Sprinkles"
];