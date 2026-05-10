"use client";

import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminApiError, adminFetch, type MeResponse, type RegisterStatusResponse } from "../../../lib/adminClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [registerOpen, setRegisterOpen] = useState<boolean | null>(null);
  const [bootstrap, setBootstrap] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await adminFetch<MeResponse>("/me");
        if (!cancelled) router.replace("/admin");
      } catch {
        /* not logged in */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/auth/register-status");
        const j = (await r.json()) as RegisterStatusResponse;
        if (!cancelled) {
          setRegisterOpen(Boolean(j.open));
          setBootstrap(Boolean(j.bootstrap));
        }
      } catch {
        if (!cancelled) {
          setRegisterOpen(false);
          setBootstrap(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hint = useMemo(() => {
    if (registerOpen === null) return "Checking registration options…";
    if (!registerOpen) return "Sign in with your admin email and password.";
    if (bootstrap) return "No admin exists yet — sign up to create the first account, or sign in if you already have one.";
    return "Open registration is enabled — you can create a new admin account or sign in.";
  }, [registerOpen, bootstrap]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      router.replace("/admin");
    } catch (err) {
      const msg = err instanceof AdminApiError ? err.body : "Something went wrong.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(59,130,246,0.2),transparent)] dark:bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(59,130,246,0.15),transparent)]" />
      <div className="relative mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/85 shadow-2xl shadow-slate-300/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/50">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-10 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur">
                <Image
                  src="/logo.jpeg"
                  alt="ZeoFex"
                  width={44}
                  height={44}
                  priority
                  className="h-full w-full object-contain p-1.5"
                />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">ZeoFex</p>
                <h1 className="text-xl font-bold tracking-tight">Welcome back</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-blue-50/95">{hint}</p>
          </div>

          <div className="p-8">
            <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                  placeholder="you@company.com"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                  placeholder="••••••••"
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock className="h-4 w-4 opacity-90" />
                {busy ? "Please wait…" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              {registerOpen === true ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/admin/register"
                    className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Sign up
                  </Link>
                </p>
              ) : registerOpen === false ? (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Registration is closed for this deployment. Contact your administrator if you need access.
                </span>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">Checking registration…</span>
              )}
              <Link
                href="/"
                className="text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                ← Back to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
