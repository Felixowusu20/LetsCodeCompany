import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { getClientProjects, type ClientProjectCard } from "../../lib/serverContent";

export const dynamic = "force-dynamic";

function LucideByName({ name, className }: { name: string; className?: string }) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<Record<string, unknown>>>;
  const Comp = icons[name];
  if (!Comp || typeof Comp !== "function") return null;
  return <Comp className={className} size={22} aria-hidden />;
}

function ProjectCard({ p }: { p: ClientProjectCard }) {
  const hasImage = Boolean(p.imageUrl?.trim());
  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/40">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        {hasImage ? (
          <Image
            src={p.imageUrl}
            alt={p.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {p.iconUrl?.trim() ? (
          <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-1.5 shadow-lg backdrop-blur dark:bg-white/90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.iconUrl} alt="" className="h-full w-full object-contain" />
          </div>
        ) : p.iconLucide ? (
          <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/95 shadow-lg backdrop-blur dark:bg-slate-900/90">
            <LucideByName name={p.iconLucide} className="text-blue-600 dark:text-blue-400" />
          </div>
        ) : null}

        {p.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-blue-900/30">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {p.clientName ? <span>{p.clientName}</span> : null}
          {p.clientName && p.year != null ? <span aria-hidden>·</span> : null}
          {p.year != null ? <span>{p.year}</span> : null}
        </div>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{p.title}</h2>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.description}</p>
        {p.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6">
          <a
            href={p.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700"
          >
            View project
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function WorkPage() {
  const projects = await getClientProjects();
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-slate-950/90 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-300">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="font-semibold text-white">Work</span>
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.32em] text-blue-300">Client projects</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Work we are proud to ship</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Selected builds and collaborations — from polished marketing sites to complex product experiences.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-300">No client projects yet. Check back soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
