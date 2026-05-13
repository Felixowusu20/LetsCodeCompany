import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Handshake,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Paintbrush,
  PanelBottom,
  PanelsTopLeft,
  Puzzle,
  Users,
} from "lucide-react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";

type AdminCard = {
  href: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

const cards: AdminCard[] = [
  {
    href: "/admin/branding",
    title: "Brand & logo",
    desc: "Navbar and admin logos for light and dark UI.",
    icon: Paintbrush,
  },
  {
    href: "/admin/hero",
    title: "Homepage hero",
    desc: "Carousel slides, imagery, headlines, and CTAs.",
    icon: ImageIcon,
  },
  {
    href: "/admin/about",
    title: "About page",
    desc: "Story, mission, vision, and values content.",
    icon: FileText,
  },
  {
    href: "/admin/services",
    title: "Services",
    desc: "Service listings shown on the marketing site.",
    icon: Puzzle,
  },
  {
    href: "/admin/members",
    title: "Team members",
    desc: "People and bios on the team page.",
    icon: Users,
  },
  {
    href: "/admin/projects",
    title: "Projects",
    desc: "Portfolio items and product-style entries.",
    icon: PanelsTopLeft,
  },
  {
    href: "/admin/blogs",
    title: "Blog posts",
    desc: "Articles, excerpts, and featured images.",
    icon: BookOpen,
  },
  {
    href: "/admin/partners",
    title: "Partners",
    desc: "Logos and links for the partner marquee.",
    icon: Handshake,
  },
  {
    href: "/admin/partner-applications",
    title: "Partner applications",
    desc: "Submissions from the Become-a-partner form.",
    icon: Handshake,
  },
  {
    href: "/admin/contacts",
    title: "Contacts",
    desc: "Inbound form submissions and export.",
    icon: Mail,
  },
  {
    href: "/admin/footer",
    title: "Footer",
    desc: "Columns, CTA, legal links, and social profiles.",
    icon: PanelBottom,
  },
];

export default function AdminHomePage() {
  return (
    <AdminShell>
      <div className="space-y-10">
        <header className="border-b border-slate-200/90 pb-8 dark:border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Content control
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Dashboard
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Edit what visitors see on the public site. Images upload through the admin
                uploader (Cloudinary when configured). Changes apply after you save each
                section.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              View site
              <ArrowUpRight className="h-4 w-4 opacity-70" />
            </Link>
          </div>
        </header>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                All sections
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Pick an area to load its editor.
              </p>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300 sm:inline-block">
              {cards.length} areas
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-slate-900/40 dark:hover:border-blue-500/35 dark:hover:shadow-lg dark:hover:shadow-blue-950/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 opacity-0 transition group-hover:opacity-100 dark:bg-white/10 dark:text-slate-400">
                      Edit
                    </span>
                  </div>
                  <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </div>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {card.desc}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Open
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/80 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
            <span>
              Tip: use the sidebar on large screens for quick jumps—same links as above.
            </span>
          </p>
        </footer>
      </div>
    </AdminShell>
  );
}
