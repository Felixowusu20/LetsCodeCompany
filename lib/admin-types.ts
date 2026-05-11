export type Id = string;

export type Member = {
  id: Id;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type BlogPost = {
  id: Id;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  authorAvatar: string;
  comments: number;
};

export type Project = {
  id: Id;
  title: string;
  description: string;
  image: string;
  tags: string[];
  websiteUrl?: string | null;
  downloadUrl?: string | null;
};

export type Partner = {
  id: Id;
  name: string;
  logo: string;
  website?: string;
};

export type ContactSubmission = {
  id: Id;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectDetails?: string;
  message: string;
  createdAt: string;
  status: "new" | "in_progress" | "closed";
};

export type HeroSlide = {
  id: Id;
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string | null;
  cta: string;
  sortOrder: number;
};
