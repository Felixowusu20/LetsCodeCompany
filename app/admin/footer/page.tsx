"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type FooterLink = { label: string; href: string };

type FooterSocialLink = { platform: string; href: string; label: string };

type FooterDto = {
  id: string;
  companyName: string;
  tagline: string;
  exploreColumnTitle: string;
  exploreLinks: FooterLink[];
  companyColumnTitle: string;
  companyLinks: FooterLink[];
  ctaTitle: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  copyrightText: string;
  termsLabel: string;
  termsHref: string;
  socialColumnTitle: string;
  socialLinks: FooterSocialLink[];
  updatedAt: string;
};

const SOCIAL_PLATFORM_OPTIONS: { value: string; label: string }[] = [
  { value: "x", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "tiktok", label: "TikTok" },
  { value: "threads", label: "Threads" },
  { value: "bluesky", label: "Bluesky" },
  { value: "discord", label: "Discord" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "medium", label: "Medium" },
  { value: "other", label: "Other (generic icon)" },
];

type Draft = Omit<FooterDto, "id" | "updatedAt">;

function emptyDraft(): Draft {
  return {
    companyName: "",
    tagline: "",
    exploreColumnTitle: "",
    exploreLinks: [],
    companyColumnTitle: "",
    companyLinks: [],
    ctaTitle: "",
    ctaBody: "",
    ctaButtonLabel: "",
    ctaButtonHref: "",
    copyrightText: "",
    termsLabel: "",
    termsHref: "",
    socialColumnTitle: "",
    socialLinks: [],
  };
}

function fromDto(d: FooterDto): Draft {
  return {
    companyName: d.companyName,
    tagline: d.tagline,
    exploreColumnTitle: d.exploreColumnTitle,
    exploreLinks: d.exploreLinks ?? [],
    companyColumnTitle: d.companyColumnTitle,
    companyLinks: d.companyLinks ?? [],
    ctaTitle: d.ctaTitle,
    ctaBody: d.ctaBody,
    ctaButtonLabel: d.ctaButtonLabel,
    ctaButtonHref: d.ctaButtonHref,
    copyrightText: d.copyrightText,
    termsLabel: d.termsLabel,
    termsHref: d.termsHref,
    socialColumnTitle: d.socialColumnTitle,
    socialLinks: d.socialLinks ?? [],
  };
}

function toPayload(draft: Draft) {
  return {
    companyName: draft.companyName.trim(),
    tagline: draft.tagline.trim(),
    exploreColumnTitle: draft.exploreColumnTitle.trim(),
    exploreLinks: draft.exploreLinks.map((l) => ({
      label: l.label.trim(),
      href: l.href.trim(),
    })),
    companyColumnTitle: draft.companyColumnTitle.trim(),
    companyLinks: draft.companyLinks.map((l) => ({
      label: l.label.trim(),
      href: l.href.trim(),
    })),
    ctaTitle: draft.ctaTitle.trim(),
    ctaBody: draft.ctaBody.trim(),
    ctaButtonLabel: draft.ctaButtonLabel.trim(),
    ctaButtonHref: draft.ctaButtonHref.trim(),
    copyrightText: draft.copyrightText.trim(),
    termsLabel: draft.termsLabel.trim(),
    termsHref: draft.termsHref.trim(),
    socialColumnTitle: draft.socialColumnTitle.trim(),
    socialLinks: draft.socialLinks.map((s) => ({
      platform: s.platform.trim().toLowerCase() || "other",
      href: s.href.trim(),
      label: s.label.trim(),
    })),
  };
}

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20";

const textareaClass = `${inputClass} resize-y`;

const labelTextClass =
  "text-sm font-semibold text-slate-700 dark:text-slate-200";

const sectionWrapperClass =
  "rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/40 sm:p-6";

export default function AdminFooterPage() {
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<FooterDto>("/footer");
      setDraft(fromDto(data));
      setSavedAt(data.updatedAt);
      setLoadError(null);
      setLoaded(true);
    } catch (e) {
      setLoadError(
        e instanceof AdminApiError ? e.body : "Could not load Footer content.",
      );
      setLoaded(true);
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  const canSave = useMemo(() => {
    return (
      loaded &&
      !saving &&
      draft.companyName.trim().length > 0 &&
      draft.termsLabel.trim().length > 0 &&
      draft.termsHref.trim().length > 0
    );
  }, [draft.companyName, draft.termsHref, draft.termsLabel, loaded, saving]);

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const data = await adminFetch<FooterDto>("/footer", {
        method: "PUT",
        body: JSON.stringify(toPayload(draft)),
      });
      setDraft(fromDto(data));
      setSavedAt(data.updatedAt);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function updateExplore(index: number, patch: Partial<FooterLink>) {
    setDraft((d) => ({
      ...d,
      exploreLinks: d.exploreLinks.map((l, i) =>
        i === index ? { ...l, ...patch } : l,
      ),
    }));
  }

  function addExplore() {
    setDraft((d) => ({
      ...d,
      exploreLinks: [...d.exploreLinks, { label: "", href: "" }],
    }));
  }

  function removeExplore(index: number) {
    setDraft((d) => ({
      ...d,
      exploreLinks: d.exploreLinks.filter((_, i) => i !== index),
    }));
  }

  function updateCompany(index: number, patch: Partial<FooterLink>) {
    setDraft((d) => ({
      ...d,
      companyLinks: d.companyLinks.map((l, i) =>
        i === index ? { ...l, ...patch } : l,
      ),
    }));
  }

  function addCompany() {
    setDraft((d) => ({
      ...d,
      companyLinks: [...d.companyLinks, { label: "", href: "" }],
    }));
  }

  function removeCompany(index: number) {
    setDraft((d) => ({
      ...d,
      companyLinks: d.companyLinks.filter((_, i) => i !== index),
    }));
  }

  function updateSocial(index: number, patch: Partial<FooterSocialLink>) {
    setDraft((d) => ({
      ...d,
      socialLinks: d.socialLinks.map((s, i) =>
        i === index ? { ...s, ...patch } : s,
      ),
    }));
  }

  function addSocial() {
    setDraft((d) => ({
      ...d,
      socialLinks: [
        ...d.socialLinks,
        { platform: "x", href: "", label: "X (Twitter)" },
      ],
    }));
  }

  function removeSocial(index: number) {
    setDraft((d) => ({
      ...d,
      socialLinks: d.socialLinks.filter((_, i) => i !== index),
    }));
  }

  return (
    <AdminShell>
      {loadError ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {loadError}
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Footer content
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Edits the site-wide footer, including legal links and navigation columns.
          </p>
          {savedAt ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Last updated {new Date(savedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={!canSave}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="space-y-6">
        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Brand
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className={labelTextClass}>Company name</span>
              <input
                className={inputClass}
                value={draft.companyName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, companyName: e.target.value }))
                }
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelTextClass}>Tagline</span>
              <textarea
                className={textareaClass}
                rows={3}
                value={draft.tagline}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, tagline: e.target.value }))
                }
              />
            </label>
          </div>
        </section>

        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Explore column
          </h3>
          <label className="mt-4 block max-w-md">
            <span className={labelTextClass}>Column heading</span>
            <input
              className={inputClass}
              value={draft.exploreColumnTitle}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  exploreColumnTitle: e.target.value,
                }))
              }
            />
          </label>
          <div className="mt-4 space-y-3">
            {draft.exploreLinks.map((link, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-end"
              >
                <label className="block flex-1">
                  <span className={labelTextClass}>Label</span>
                  <input
                    className={inputClass}
                    value={link.label}
                    onChange={(e) =>
                      updateExplore(i, { label: e.target.value })
                    }
                  />
                </label>
                <label className="block flex-1">
                  <span className={labelTextClass}>URL</span>
                  <input
                    className={inputClass}
                    value={link.href}
                    onChange={(e) =>
                      updateExplore(i, { href: e.target.value })
                    }
                    placeholder="/about"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeExplore(i)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExplore}
              className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-white/20 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              Add link
            </button>
          </div>
        </section>

        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Company column
          </h3>
          <label className="mt-4 block max-w-md">
            <span className={labelTextClass}>Column heading</span>
            <input
              className={inputClass}
              value={draft.companyColumnTitle}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  companyColumnTitle: e.target.value,
                }))
              }
            />
          </label>
          <div className="mt-4 space-y-3">
            {draft.companyLinks.map((link, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-end"
              >
                <label className="block flex-1">
                  <span className={labelTextClass}>Label</span>
                  <input
                    className={inputClass}
                    value={link.label}
                    onChange={(e) =>
                      updateCompany(i, { label: e.target.value })
                    }
                  />
                </label>
                <label className="block flex-1">
                  <span className={labelTextClass}>URL</span>
                  <input
                    className={inputClass}
                    value={link.href}
                    onChange={(e) =>
                      updateCompany(i, { href: e.target.value })
                    }
                    placeholder="/contact"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeCompany(i)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCompany}
              className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-white/20 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              Add link
            </button>
          </div>
        </section>

        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Social media
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Icon URLs use{" "}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              Simple Icons
            </span>{" "}
            by slug (shown next to each row). Use full URLs starting with{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/10">
              https://
            </code>
            .
          </p>
          <label className="mt-4 block max-w-md">
            <span className={labelTextClass}>Section heading</span>
            <input
              className={inputClass}
              value={draft.socialColumnTitle}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  socialColumnTitle: e.target.value,
                }))
              }
              placeholder="Follow us"
            />
          </label>
          <div className="mt-4 space-y-3">
            {draft.socialLinks.map((link, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5 lg:flex-row lg:items-end"
              >
                <label className="block w-full max-w-[220px]">
                  <span className={labelTextClass}>Network</span>
                  <select
                    className={inputClass}
                    value={link.platform}
                    onChange={(e) =>
                      updateSocial(i, {
                        platform: e.target.value,
                        label:
                          SOCIAL_PLATFORM_OPTIONS.find(
                            (o) => o.value === e.target.value,
                          )?.label ?? link.label,
                      })
                    }
                  >
                    {SOCIAL_PLATFORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    {!SOCIAL_PLATFORM_OPTIONS.some(
                      (o) => o.value === link.platform,
                    ) && link.platform ? (
                      <option value={link.platform}>{link.platform}</option>
                    ) : null}
                  </select>
                </label>
                <label className="block min-w-0 flex-1">
                  <span className={labelTextClass}>Profile URL</span>
                  <input
                    className={inputClass}
                    value={link.href}
                    onChange={(e) =>
                      updateSocial(i, { href: e.target.value })
                    }
                    placeholder="https://"
                  />
                </label>
                <label className="block min-w-0 flex-1">
                  <span className={labelTextClass}>Accessibility label</span>
                  <input
                    className={inputClass}
                    value={link.label}
                    onChange={(e) =>
                      updateSocial(i, { label: e.target.value })
                    }
                    placeholder="Visit our LinkedIn"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeSocial(i)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label="Remove social link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSocial}
              className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-white/20 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              Add social profile
            </button>
          </div>
        </section>

        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Call to action
          </h3>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className={labelTextClass}>Title</span>
              <input
                className={inputClass}
                value={draft.ctaTitle}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, ctaTitle: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className={labelTextClass}>Body</span>
              <textarea
                className={textareaClass}
                rows={3}
                value={draft.ctaBody}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, ctaBody: e.target.value }))
                }
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelTextClass}>Button label</span>
                <input
                  className={inputClass}
                  value={draft.ctaButtonLabel}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      ctaButtonLabel: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                <span className={labelTextClass}>Button URL</span>
                <input
                  className={inputClass}
                  value={draft.ctaButtonHref}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      ctaButtonHref: e.target.value,
                    }))
                  }
                  placeholder="/contact"
                />
              </label>
            </div>
          </div>
        </section>

        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Legal & copyright
          </h3>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className={labelTextClass}>Copyright line</span>
              <input
                className={inputClass}
                value={draft.copyrightText}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    copyrightText: e.target.value,
                  }))
                }
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelTextClass}>Terms label</span>
                <input
                  className={inputClass}
                  value={draft.termsLabel}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      termsLabel: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                <span className={labelTextClass}>Terms URL (href)</span>
                <input
                  className={inputClass}
                  value={draft.termsHref}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      termsHref: e.target.value,
                    }))
                  }
                  placeholder="/terms"
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
