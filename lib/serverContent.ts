import { prisma } from "./prisma";
import {
  mockBlogPosts,
  mockHeroSlides,
  mockPartners,
  mockProducts,
  mockServices,
  mockTeamMembers,
} from "./mockData";

export type HomeHeroSlide = {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type Partner = {
  id: string;
  name: string;
  logo: string;
  website: string | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image: string;
  sortOrder: number;
};

export type ProductCard = {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  websiteUrl?: string | null;
  downloadUrl?: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  authorAvatar: string;
  comments: number;
};

export async function getHomeHeroSlides(): Promise<HomeHeroSlide[]> {
  try {
    const rows = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) {
      return mockHeroSlides.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        image: s.image,
        cta: s.cta,
      }));
    }
    return rows.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      cta: s.cta,
    }));
  } catch {
    return mockHeroSlides.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      cta: s.cta,
    }));
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const rows = await prisma.member.findMany({ orderBy: [{ createdAt: "asc" }] });
    if (rows.length === 0) {
      return mockTeamMembers.map((m) => ({
        id: String(m.id),
        name: m.name,
        role: m.role,
        bio: m.bio,
        image: m.image,
      }));
    }
    return rows.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio,
      image: m.image,
    }));
  } catch {
    return mockTeamMembers.map((m) => ({
      id: String(m.id),
      name: m.name,
      role: m.role,
      bio: m.bio,
      image: m.image,
    }));
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const rows = await prisma.partner.findMany({ orderBy: [{ createdAt: "asc" }] });
    if (rows.length === 0) {
      return mockPartners.map((p, idx) => ({
        id: `mock-${idx}`,
        name: p.name,
        logo: p.logo,
        website: null,
      }));
    }
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      logo: p.logo,
      website: p.website ?? null,
    }));
  } catch {
    return mockPartners.map((p, idx) => ({
      id: `mock-${idx}`,
      name: p.name,
      logo: p.logo,
      website: null,
    }));
  }
}

function mockProductToCard(m: (typeof mockProducts)[number]): ProductCard {
  return {
    id: String(m.id),
    name: m.name,
    description: m.description,
    image: m.image,
    tags: [],
    websiteUrl: null,
    downloadUrl: null,
  };
}

export async function getProjectsAsProducts(): Promise<ProductCard[]> {
  try {
    const rows = await prisma.project.findMany({ orderBy: [{ createdAt: "desc" }] });
    if (rows.length === 0) {
      return mockProducts.map(mockProductToCard);
    }
    return rows.map((p) => ({
      id: p.id,
      name: p.title,
      description: p.description,
      image: p.image,
      tags: p.tags ?? [],
      websiteUrl: p.websiteUrl ?? null,
      downloadUrl: p.downloadUrl ?? null,
    }));
  } catch {
    return mockProducts.map(mockProductToCard);
  }
}

/** Single product/project for detail page — avoids loading all rows. */
export async function getProductCardById(id: string): Promise<ProductCard | null> {
  if (!id) return null;
  try {
    const p = await prisma.project.findUnique({ where: { id } });
    if (p) {
      return {
        id: p.id,
        name: p.title,
        description: p.description,
        image: p.image,
        tags: p.tags ?? [],
        websiteUrl: p.websiteUrl ?? null,
        downloadUrl: p.downloadUrl ?? null,
      };
    }
  } catch {
    /* fall through to mock */
  }
  const mock = mockProducts.find((m) => String(m.id) === id);
  return mock ? mockProductToCard(mock) : null;
}

export async function getServices(): Promise<Service[]> {
  try {
    const rows = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    if (rows.length === 0) {
      return mockServices.map((s, i) => ({
        id: String(s.id),
        title: s.title,
        description: s.description,
        icon: s.icon ?? null,
        image: s.image,
        sortOrder: i,
      }));
    }
    return rows.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon ?? null,
      image: s.image,
      sortOrder: s.sortOrder,
    }));
  } catch {
    return mockServices.map((s, i) => ({
      id: String(s.id),
      title: s.title,
      description: s.description,
      icon: s.icon ?? null,
      image: s.image,
      sortOrder: i,
    }));
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.id === id) ?? null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({ orderBy: [{ updatedAt: "desc" }] });
    if (rows.length === 0) {
      return mockBlogPosts.map((p) => ({
        id: String(p.id),
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        author: p.author,
        date: p.date,
        image: p.image,
        authorAvatar: p.authorAvatar,
        comments: p.comments,
      }));
    }
    return rows.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date,
      image: p.image,
      authorAvatar: p.authorAvatar,
      comments: p.comments,
    }));
  } catch {
    return mockBlogPosts.map((p) => ({
      id: String(p.id),
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date,
      image: p.image,
      authorAvatar: p.authorAvatar,
      comments: p.comments,
    }));
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.id === id) ?? null;
}
