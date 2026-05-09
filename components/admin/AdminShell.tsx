"use client";

import {
  BookOpen,
  Handshake,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  PanelsTopLeft,
  Puzzle,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminFetch, type MeResponse } from "../../lib/adminClient";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true as const },
  { href: "/admin/hero", label: "Homepage hero", icon: ImageIcon, end: false as const },
  { href: "/admin/members", label: "Members", icon: Users, end: false as const },
  { href: "/admin/services", label: "Services", icon: Puzzle, end: false as const },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen, end: false as const },
  { href: "/admin/projects", label: "Projects", icon: PanelsTopLeft, end: false as const },
  { href: "/admin/partners", label: "Partners", icon: Handshake, end: false as const },
  { href: "/admin/contacts", label: "Contacts", icon: Mail, end: false as const },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await adminFetch<MeResponse>("/me");
        if (!cancelled) setEmail(me.email);
      } catch {
        if (!cancelled) router.replace("/admin/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const crumbs = useMemo(() => {
    if (pathname === "/admin") return "Dashboard";
    const current = nav.find((n) => {
      if (n.end) return false;
      return pathname === n.href || pathname?.startsWith(`${n.href}/`);
    });
    return current?.label ?? "Dashboard";
  }, [pathname]);

  async function onSignOut() {
    try {
      await adminFetch("/auth/logout", { method: "POST", body: "{}" });
    } catch {
      /* still navigate */
    }
    router.replace("/admin/login");
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.22),transparent),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(99,102,241,0.12),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
              <Sparkles className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">LetsCode</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">{crumbs}</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Signed in as <span className="font-semibold text-slate-900 dark:text-slate-200">{email ?? "…"}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 opacity-70" />
            Sign out
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <aside className="h-fit rounded-3xl border border-white/60 bg-white/70 p-3 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/40">
            <nav className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = item.end
                  ? pathname === item.href
                  : pathname === item.href || Boolean(pathname?.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-500 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-h-[480px] rounded-3xl border border-white/60 bg-white/80 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 dark:shadow-black/50 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
