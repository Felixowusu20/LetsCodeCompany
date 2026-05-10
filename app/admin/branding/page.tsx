"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminShell from "../../../components/admin/AdminShell";
import ImageUpload from "../../../components/admin/ImageUpload";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type BrandingDto = {
  id: string;
  logoWhenUiLightUrl: string;
  logoWhenUiDarkUrl: string;
  adminPanelLogoUrl: string;
  updatedAt: string;
};

type Draft = Omit<BrandingDto, "id" | "updatedAt">;

function emptyDraft(): Draft {
  return {
    logoWhenUiLightUrl: "",
    logoWhenUiDarkUrl: "",
    adminPanelLogoUrl: "",
  };
}

function fromDto(d: BrandingDto): Draft {
  return {
    logoWhenUiLightUrl: d.logoWhenUiLightUrl ?? "",
    logoWhenUiDarkUrl: d.logoWhenUiDarkUrl ?? "",
    adminPanelLogoUrl: d.adminPanelLogoUrl ?? "",
  };
}

const sectionClass =
  "rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/40 sm:p-6";
const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-200";
const helpClass = "mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400";

export default function AdminBrandingPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<BrandingDto>("/branding");
      setDraft(fromDto(data));
      setSavedAt(data.updatedAt);
      setLoadError(null);
      setLoaded(true);
    } catch (e) {
      setLoadError(
        e instanceof AdminApiError ? e.body : "Could not load branding.",
      );
      setLoaded(true);
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  const previewLight = draft.logoWhenUiLightUrl.trim() || "/whitelog.jpeg";
  const previewDark = draft.logoWhenUiDarkUrl.trim() || "/logo.jpeg";
  const previewAdmin = draft.adminPanelLogoUrl.trim() || previewDark;

  const canSave = useMemo(
    () => loaded && !saving,
    [loaded, saving],
  );

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const data = await adminFetch<BrandingDto>("/branding", {
        method: "PUT",
        body: JSON.stringify({
          logoWhenUiLightUrl: draft.logoWhenUiLightUrl.trim(),
          logoWhenUiDarkUrl: draft.logoWhenUiDarkUrl.trim(),
          adminPanelLogoUrl: draft.adminPanelLogoUrl.trim(),
        }),
      });
      setDraft(fromDto(data));
      setSavedAt(data.updatedAt);
      setLoadError(null);
      router.refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      {loadError ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {loadError}
        </div>
      ) : null}

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Brand & logo
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Upload logos for the public navbar (light vs dark UI) and for the admin sign-in page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {savedAt ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Last saved {new Date(savedAt).toLocaleString()}
            </span>
          ) : null}
          <button
            type="button"
            disabled={!canSave}
            onClick={() => void onSave()}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={sectionClass}>
          <p className={labelClass}>Navbar — light UI</p>
          <p className={helpClass}>
            Shown when visitors use light mode (bar on white glass).{" "}
            <strong>Recommended:</strong> wide horizontal logo{" "}
            <strong>520 × 96 px</strong> (or <strong>1040 × 192 px</strong> for retina), PNG or WebP with transparent background. Aspect ~ <strong>5.4:1</strong>.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Preview on light</p>
            <div className="mt-3 flex h-14 items-center justify-start rounded-xl bg-white px-3 shadow-inner">
              <div className="relative h-10 w-[200px]">
                <Image
                  src={previewLight}
                  alt="Preview light navbar"
                  fill
                  className="object-contain object-left"
                  sizes="200px"
                  unoptimized={previewLight.startsWith("http")}
                />
              </div>
            </div>
          </div>
          <ImageUpload
            label="Upload"
            value={draft.logoWhenUiLightUrl}
            onChange={(url) =>
              setDraft((d) => ({ ...d, logoWhenUiLightUrl: url }))
            }
            hint="Leave empty to use the default file in /public."
          />
        </section>

        <section className={sectionClass}>
          <p className={labelClass}>Navbar — dark UI</p>
          <p className={helpClass}>
            Shown when visitors use dark mode. Same dimensions as light UI — typically a light-colored wordmark on transparent PNG.
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
            <p className="text-xs font-medium text-slate-400">Preview on dark</p>
            <div className="mt-3 flex h-14 items-center justify-start rounded-xl bg-slate-950 px-3">
              <div className="relative h-10 w-[200px]">
                <Image
                  src={previewDark}
                  alt="Preview dark navbar"
                  fill
                  className="object-contain object-left"
                  sizes="200px"
                  unoptimized={previewDark.startsWith("http")}
                />
              </div>
            </div>
          </div>
          <ImageUpload
            label="Upload"
            value={draft.logoWhenUiDarkUrl}
            onChange={(url) =>
              setDraft((d) => ({ ...d, logoWhenUiDarkUrl: url }))
            }
          />
        </section>

        <section className={`${sectionClass} lg:col-span-2`}>
          <p className={labelClass}>Admin panel & login</p>
          <p className={helpClass}>
            Square mark next to “ZeoFex” on login and admin.{" "}
            <strong>Recommended:</strong> <strong>256 × 256 px</strong> (min <strong>128 px</strong>) square PNG — displays at <strong>44–48 px</strong>. If empty, we use the dark-navbar logo.
          </p>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg dark:border-white/10">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/20">
                <Image
                  src={previewAdmin}
                  alt="Admin preview"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain p-1.5"
                  unoptimized={previewAdmin.startsWith("http")}
                />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                  ZeoFex
                </p>
                <p className="text-lg font-bold">Preview</p>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <ImageUpload
                label="Upload admin logo"
                value={draft.adminPanelLogoUrl}
                onChange={(url) =>
                  setDraft((d) => ({ ...d, adminPanelLogoUrl: url }))
                }
              />
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
