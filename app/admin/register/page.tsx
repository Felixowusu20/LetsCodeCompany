"use client";

import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminApiError, adminFetch, type MeResponse, type RegisterStatusResponse } from "../../../lib/adminClient";

export default function AdminRegisterPage() {
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
    if (registerOpen === false) {
      return "An admin account already exists for this database. Sign in with your credentials.";
    }
    if (registerOpen === true && bootstrap === true) {
      return "Create the first admin account for this database. You can sign in normally afterward.";
    }
    if (registerOpen === true && bootstrap === false) {
      return "Create a new admin account. You will be signed in after registration.";
    }
    return "Checking registration…";
  }, [registerOpen, bootstrap]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (registerOpen !== true) return;
    setError(null);
    setBusy(true);
    try {
      await adminFetch("/auth/register", {
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

  const showDisabled = registerOpen === false;

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
                <h1 className="text-xl font-bold tracking-tight">{showDisabled ? "Registration unavailable" : "Create admin"}</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-blue-50/95">{hint}</p>
            {registerOpen === true && bootstrap === false && (
              <p className="mt-2 text-xs font-medium text-blue-100/90">Open registration is enabled.</p>
            )}
          </div>

          <div className="p-8">
            {registerOpen === null ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400" aria-label="Loading" />
              </div>
            ) : showDisabled ? (
              <div className="space-y-6">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Registration is disabled because an admin user already exists. Use the sign-in page if you have access.
                </p>
                <Link
                  href="/admin/login"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700"
                >
                  Go to sign in
                </Link>
              </div>
            ) : (
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
                    autoComplete="new-password"
                    minLength={8}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                    placeholder="••••••••"
                  />
                </label>

                <p className="text-xs text-slate-500 dark:text-slate-400">Use at least 8 characters for your password.</p>

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
                  {busy ? "Please wait…" : "Create account"}
                </button>
              </form>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/admin/login"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Already have an account? Sign in
              </Link>
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
