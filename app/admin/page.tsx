import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import AdminShell from "../../components/admin/AdminShell";

const cards = [
  { href: "/admin/hero", title: "Homepage hero", desc: "Carousel slides (images, copy, CTA)" },
  { href: "/admin/members", title: "Members", desc: "Team members" },
  { href: "/admin/blogs", title: "Blogs", desc: "Blog posts" },
  { href: "/admin/projects", title: "Projects", desc: "Portfolio projects" },
  { href: "/admin/partners", title: "Partners", desc: "Partner logos" },
  { href: "/admin/contacts", title: "Contacts", desc: "Contact form submissions" },
] as const;

export default function AdminHomePage() {
  return (
    <AdminShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Neon PostgreSQL · Prisma · Secure session</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Manage content that powers the marketing site. Images upload to <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-white/10">/public/uploads</code>{" "}
            (ideal for VPS or local deploys; for serverless-only hosting, add object storage later).
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/25">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-blue-500/30"
          >
            <div className="text-base font-semibold text-slate-900 dark:text-white">{card.title}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{card.desc}</div>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
              Open
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
