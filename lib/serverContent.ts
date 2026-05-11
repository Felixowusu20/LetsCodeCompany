import { prisma, prismaDelegateOrNull } from "./prisma";
import {
  aboutMock,
  footerMock,
  mockBlogPosts,
  mockHeroSlides,
  mockPartners,
  mockProducts,
  mockServices,
  mockTeamMembers,
} from "./mockData";
import type { SiteBranding } from "./siteBranding";
export type { SiteBranding } from "./siteBranding";
import {
  coerceFooterSocialLinks,
  slugifySocialPlatform,
} from "./footerSocial";
import type { FooterSocialLinkItem } from "./footerSocial";

export type { FooterSocialLinkItem } from "./footerSocial";

export type HomeHeroSlide = {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string | null;
  cta: string;
};

function trimmedOrNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

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
        videoUrl: trimmedOrNull(s.videoUrl),
        cta: s.cta,
      }));
    }
    return rows.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      videoUrl: trimmedOrNull(s.videoUrl),
      cta: s.cta,
    }));
  } catch {
    return mockHeroSlides.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      videoUrl: trimmedOrNull(s.videoUrl),
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

export type AboutValueItem = {
  title: string;
  desc: string;
  image: string;
};

export type AboutContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  missionTitle: string;
  missionText: string;
  missionImage: string;
  visionTitle: string;
  visionText: string;
  visionImage: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValueItem[];
};

function fallbackAboutContent(): AboutContent {
  return {
    heroEyebrow: `About ${aboutMock.company}`,
    heroTitle: "Powerful service design for modern product teams.",
    heroSubtitle:
      "We combine engineering, design, and strategy to build digital products that feel premium and scale effortlessly.",
    storyTitle: aboutMock.story.title,
    storyParagraphs: aboutMock.story.paragraphs,
    storyImage: aboutMock.story.image,
    missionTitle: aboutMock.mission.title,
    missionText: aboutMock.mission.text,
    missionImage: aboutMock.mission.image,
    visionTitle: aboutMock.vision.title,
    visionText: aboutMock.vision.text,
    visionImage: aboutMock.vision.image,
    valuesTitle: "Our Values",
    valuesSubtitle:
      "The principles that guide our work and shape every customer experience.",
    values: aboutMock.values.map((v) => ({
      title: v.title,
      desc: v.desc,
      image: v.image,
    })),
  };
}

function coerceValues(raw: unknown): AboutValueItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title : "";
      const desc = typeof obj.desc === "string" ? obj.desc : "";
      const image = typeof obj.image === "string" ? obj.image : "";
      if (!title && !desc && !image) return null;
      return { title, desc, image } satisfies AboutValueItem;
    })
    .filter((v): v is AboutValueItem => v !== null);
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    if (!prismaDelegateOrNull("aboutContent")) return fallbackAboutContent();
    const row = await prisma.aboutContent!.findFirst({
      orderBy: [{ updatedAt: "desc" }],
    });
    if (!row) return fallbackAboutContent();
    return {
      heroEyebrow: row.heroEyebrow,
      heroTitle: row.heroTitle,
      heroSubtitle: row.heroSubtitle,
      storyTitle: row.storyTitle,
      storyParagraphs: row.storyParagraphs ?? [],
      storyImage: row.storyImage,
      missionTitle: row.missionTitle,
      missionText: row.missionText,
      missionImage: row.missionImage,
      visionTitle: row.visionTitle,
      visionText: row.visionText,
      visionImage: row.visionImage,
      valuesTitle: row.valuesTitle,
      valuesSubtitle: row.valuesSubtitle,
      values: coerceValues(row.values),
    };
  } catch {
    return fallbackAboutContent();
  }
}

export type FooterLinkItem = { label: string; href: string };

export type FooterContent = {
  companyName: string;
  tagline: string;
  exploreColumnTitle: string;
  exploreLinks: FooterLinkItem[];
  companyColumnTitle: string;
  companyLinks: FooterLinkItem[];
  ctaTitle: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  copyrightText: string;
  termsLabel: string;
  termsHref: string;
  socialColumnTitle: string;
  socialLinks: FooterSocialLinkItem[];
};

function coerceFooterLinks(raw: unknown): FooterLinkItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): FooterLinkItem | null => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const label = typeof obj.label === "string" ? obj.label.trim() : "";
      const href = typeof obj.href === "string" ? obj.href.trim() : "";
      if (!label || !href) return null;
      return { label, href };
    })
    .filter((v): v is FooterLinkItem => v !== null);
}

function fallbackFooterContent(): FooterContent {
  return {
    companyName: footerMock.companyName,
    tagline: footerMock.tagline,
    exploreColumnTitle: footerMock.exploreColumnTitle,
    exploreLinks: footerMock.exploreLinks.map((l) => ({ ...l })),
    companyColumnTitle: footerMock.companyColumnTitle,
    companyLinks: footerMock.companyLinks.map((l) => ({ ...l })),
    ctaTitle: footerMock.ctaTitle,
    ctaBody: footerMock.ctaBody,
    ctaButtonLabel: footerMock.ctaButtonLabel,
    ctaButtonHref: footerMock.ctaButtonHref,
    copyrightText: footerMock.copyrightText,
    termsLabel: footerMock.termsLabel?.trim() || "Terms & Conditions",
    termsHref:
      typeof footerMock.termsHref === "string" && footerMock.termsHref.trim()
        ? footerMock.termsHref.trim()
        : "/terms",
    socialColumnTitle: footerMock.socialColumnTitle?.trim() || "Follow us",
    socialLinks: (footerMock.socialLinks ?? []).map((s) => ({
      platform: slugifySocialPlatform(s.platform),
      href: s.href.trim(),
      label: (s.label ?? "").trim() || slugifySocialPlatform(s.platform),
    })),
  };
}

export async function getFooterContent(): Promise<FooterContent> {
  try {
    if (!prismaDelegateOrNull("footerContent")) return fallbackFooterContent();
    const row = await prisma.footerContent!.findFirst({
      orderBy: [{ updatedAt: "desc" }],
    });
    if (!row) return fallbackFooterContent();
    return {
      companyName: row.companyName,
      tagline: row.tagline,
      exploreColumnTitle: row.exploreColumnTitle,
      exploreLinks: coerceFooterLinks(row.exploreLinks),
      companyColumnTitle: row.companyColumnTitle,
      companyLinks: coerceFooterLinks(row.companyLinks),
      ctaTitle: row.ctaTitle,
      ctaBody: row.ctaBody,
      ctaButtonLabel: row.ctaButtonLabel,
      ctaButtonHref: row.ctaButtonHref,
      copyrightText: row.copyrightText,
      termsLabel: row.termsLabel?.trim() || "Terms & Conditions",
      termsHref:
        typeof row.termsHref === "string" && row.termsHref.trim()
          ? row.termsHref.trim()
          : "/terms",
      socialColumnTitle: row.socialColumnTitle?.trim() || "Follow us",
      socialLinks: coerceFooterSocialLinks(row.socialLinks),
    };
  } catch {
    return fallbackFooterContent();
  }
}

function fallbackSiteBranding(): SiteBranding {
  return {
    logoWhenUiLightUrl: "/whitelog.jpeg",
    logoWhenUiDarkUrl: "/logo.jpeg",
    adminPanelLogoUrl: "/logo.jpeg",
  };
}

export async function getSiteBranding(): Promise<SiteBranding> {
  try {
    if (!prismaDelegateOrNull("siteBranding")) return fallbackSiteBranding();
    const row = await prisma.siteBranding!.findFirst({
      orderBy: [{ updatedAt: "desc" }],
    });
    if (!row) return fallbackSiteBranding();
    const fb = fallbackSiteBranding();
    const dark = row.logoWhenUiDarkUrl?.trim() || fb.logoWhenUiDarkUrl;
    const admin = row.adminPanelLogoUrl?.trim() || dark;
    return {
      logoWhenUiLightUrl: row.logoWhenUiLightUrl?.trim() || fb.logoWhenUiLightUrl,
      logoWhenUiDarkUrl: dark,
      adminPanelLogoUrl: admin,
    };
  } catch {
    return fallbackSiteBranding();
  }
}
