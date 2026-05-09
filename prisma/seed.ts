import { hashPassword } from "../lib/password";
import { prisma } from "../lib/prisma";
import { mockBlogPosts, mockHeroSlides, mockPartners, mockServices, mockTeamMembers } from "../lib/mockData";

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) {
    console.warn("Skipping admin seed: set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env");
  } else {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await hashPassword(password);
      await prisma.adminUser.create({ data: { email, passwordHash } });
      console.log("Created admin user:", email);
    } else {
      console.log("Admin user already exists:", email);
    }
  }

  const heroCount = await prisma.heroSlide.count();
  if (heroCount === 0) {
    await prisma.heroSlide.createMany({
      data: mockHeroSlides.map((s, i) => ({
        title: s.title,
        subtitle: s.subtitle,
        image: s.image,
        cta: s.cta,
        sortOrder: i,
      })),
    });
    console.log("Seeded hero slides:", mockHeroSlides.length);
  }

  const memberCount = await prisma.member.count();
  if (memberCount === 0) {
    await prisma.member.createMany({
      data: mockTeamMembers.map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        image: m.image,
      })),
    });
    console.log("Seeded members:", mockTeamMembers.length);
  }

  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    for (const p of mockBlogPosts) {
      await prisma.blogPost.create({
        data: {
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          author: p.author,
          date: p.date,
          image: p.image,
          authorAvatar: p.authorAvatar,
          comments: p.comments,
        },
      });
    }
    console.log("Seeded blog posts:", mockBlogPosts.length);
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    await prisma.partner.createMany({
      data: mockPartners.map((p) => ({
        name: p.name,
        logo: p.logo,
        website: null,
      })),
    });
    console.log("Seeded partners:", mockPartners.length);
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: mockServices.map((s, i) => ({
        title: s.title,
        description: s.description,
        icon: s.icon,
        image: s.image,
        sortOrder: i,
      })),
    });
    console.log("Seeded services:", mockServices.length);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
