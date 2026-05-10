"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import ImageUpload from "../../../components/admin/ImageUpload";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type AboutValue = { title: string; desc: string; image: string };

type AboutDto = {
  id: string;
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
  values: AboutValue[];
  updatedAt: string;
};

type Draft = Omit<AboutDto, "id" | "updatedAt" | "storyParagraphs"> & {
  storyParagraphsText: string;
};

function emptyDraft(): Draft {
  return {
    heroEyebrow: "",
    heroTitle: "",
    heroSubtitle: "",
    storyTitle: "",
    storyParagraphsText: "",
    storyImage: "",
    missionTitle: "",
    missionText: "",
    missionImage: "",
    visionTitle: "",
    visionText: "",
    visionImage: "",
    valuesTitle: "",
    valuesSubtitle: "",
    values: [],
  };
}

function fromDto(d: AboutDto): Draft {
  return {
    heroEyebrow: d.heroEyebrow,
    heroTitle: d.heroTitle,
    heroSubtitle: d.heroSubtitle,
    storyTitle: d.storyTitle,
    storyParagraphsText: (d.storyParagraphs ?? []).join("\n\n"),
    storyImage: d.storyImage,
    missionTitle: d.missionTitle,
    missionText: d.missionText,
    missionImage: d.missionImage,
    visionTitle: d.visionTitle,
    visionText: d.visionText,
    visionImage: d.visionImage,
    valuesTitle: d.valuesTitle,
    valuesSubtitle: d.valuesSubtitle,
    values: d.values ?? [],
  };
}

function toPayload(draft: Draft) {
  const paragraphs = draft.storyParagraphsText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return {
    heroEyebrow: draft.heroEyebrow.trim(),
    heroTitle: draft.heroTitle.trim(),
    heroSubtitle: draft.heroSubtitle.trim(),
    storyTitle: draft.storyTitle.trim(),
    storyParagraphs: paragraphs,
    storyImage: draft.storyImage.trim(),
    missionTitle: draft.missionTitle.trim(),
    missionText: draft.missionText.trim(),
    missionImage: draft.missionImage.trim(),
    visionTitle: draft.visionTitle.trim(),
    visionText: draft.visionText.trim(),
    visionImage: draft.visionImage.trim(),
    valuesTitle: draft.valuesTitle.trim(),
    valuesSubtitle: draft.valuesSubtitle.trim(),
    values: draft.values.map((v) => ({
      title: v.title.trim(),
      desc: v.desc.trim(),
      image: v.image.trim(),
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

export default function AdminAboutPage() {
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<AboutDto>("/about");
      setDraft(fromDto(data));
      setSavedAt(data.updatedAt);
      setLoadError(null);
      setLoaded(true);
    } catch (e) {
      setLoadError(
        e instanceof AdminApiError ? e.body : "Could not load About content.",
      );
      setLoaded(true);
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  const canSave = useMemo(() => {
    return (
      loaded &&
      !saving &&
      draft.heroTitle.trim().length > 2 &&
      draft.storyTitle.trim().length > 0
    );
  }, [draft.heroTitle, draft.storyTitle, loaded, saving]);

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const data = await adminFetch<AboutDto>("/about", {
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

  function updateValue(index: number, patch: Partial<AboutValue>) {
    setDraft((d) => ({
      ...d,
      values: d.values.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  }

  function addValue() {
    setDraft((d) => ({
      ...d,
      values: [...d.values, { title: "", desc: "", image: "" }],
    }));
  }

  function removeValue(index: number) {
    setDraft((d) => ({
      ...d,
      values: d.values.filter((_, i) => i !== index),
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
            About page content
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            These fields drive both the homepage About section and the
            standalone About page.
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
            Hero band
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Top banner shown above the About story.
          </p>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className={labelTextClass}>Eyebrow</span>
              <input
                value={draft.heroEyebrow}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, heroEyebrow: e.target.value }))
                }
                className={inputClass}
                placeholder="About ZeoFex"
              />
            </label>
            <label className="block">
              <span className={labelTextClass}>Title</span>
              <input
                value={draft.heroTitle}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, heroTitle: e.target.value }))
                }
                className={inputClass}
                placeholder="Powerful service design for modern product teams."
              />
            </label>
            <label className="block">
              <span className={labelTextClass}>Subtitle</span>
              <textarea
                value={draft.heroSubtitle}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, heroSubtitle: e.target.value }))
                }
                className={`${textareaClass} min-h-[110px]`}
                placeholder="Short supporting line…"
              />
            </label>
          </div>
        </section>

        <section className={sectionWrapperClass}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Our Story
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Separate paragraphs with a blank line.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <label className="block">
                <span className={labelTextClass}>Heading</span>
                <input
                  value={draft.storyTitle}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, storyTitle: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Our Story"
                />
              </label>
              <label className="block">
                <span className={labelTextClass}>Paragraphs</span>
                <textarea
                  value={draft.storyParagraphsText}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      storyParagraphsText: e.target.value,
                    }))
                  }
                  className={`${textareaClass} min-h-[200px]`}
                  placeholder={"First paragraph…\n\nSecond paragraph…"}
                />
              </label>
            </div>
            <ImageUpload
              label="Story image"
              value={draft.storyImage}
              onChange={(url) =>
                setDraft((d) => ({ ...d, storyImage: url }))
              }
              hint="Landscape orientation works best."
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={sectionWrapperClass}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Mission
            </h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className={labelTextClass}>Title</span>
                <input
                  value={draft.missionTitle}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, missionTitle: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Our Mission"
                />
              </label>
              <label className="block">
                <span className={labelTextClass}>Description</span>
                <textarea
                  value={draft.missionText}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, missionText: e.target.value }))
                  }
                  className={`${textareaClass} min-h-[120px]`}
                  placeholder="What we are working towards…"
                />
              </label>
              <ImageUpload
                label="Mission image"
                value={draft.missionImage}
                onChange={(url) =>
                  setDraft((d) => ({ ...d, missionImage: url }))
                }
              />
            </div>
          </section>

          <section className={sectionWrapperClass}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Vision
            </h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className={labelTextClass}>Title</span>
                <input
                  value={draft.visionTitle}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, visionTitle: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Our Vision"
                />
              </label>
              <label className="block">
                <span className={labelTextClass}>Description</span>
                <textarea
                  value={draft.visionText}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, visionText: e.target.value }))
                  }
                  className={`${textareaClass} min-h-[120px]`}
                  placeholder="Where we are headed…"
                />
              </label>
              <ImageUpload
                label="Vision image"
                value={draft.visionImage}
                onChange={(url) =>
                  setDraft((d) => ({ ...d, visionImage: url }))
                }
              />
            </div>
          </section>
        </div>

        <section className={sectionWrapperClass}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Our Values
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Cards rendered in the values grid.
              </p>
            </div>
            <button
              type="button"
              onClick={addValue}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <Plus className="h-4 w-4" /> Add value
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelTextClass}>Section title</span>
              <input
                value={draft.valuesTitle}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, valuesTitle: e.target.value }))
                }
                className={inputClass}
                placeholder="Our Values"
              />
            </label>
            <label className="block">
              <span className={labelTextClass}>Section subtitle</span>
              <input
                value={draft.valuesSubtitle}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, valuesSubtitle: e.target.value }))
                }
                className={inputClass}
                placeholder="The principles that guide our work…"
              />
            </label>
          </div>

          <div className="mt-5 space-y-4">
            {draft.values.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                No values yet. Click &ldquo;Add value&rdquo; to create one.
              </div>
            ) : null}
            {draft.values.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Value {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_240px]">
                  <div className="space-y-3">
                    <label className="block">
                      <span className={labelTextClass}>Title</span>
                      <input
                        value={value.title}
                        onChange={(e) =>
                          updateValue(index, { title: e.target.value })
                        }
                        className={inputClass}
                        placeholder="Customer First"
                      />
                    </label>
                    <label className="block">
                      <span className={labelTextClass}>Description</span>
                      <textarea
                        value={value.desc}
                        onChange={(e) =>
                          updateValue(index, { desc: e.target.value })
                        }
                        className={`${textareaClass} min-h-[90px]`}
                        placeholder="Short description…"
                      />
                    </label>
                  </div>
                  <ImageUpload
                    label="Image"
                    value={value.image}
                    onChange={(url) => updateValue(index, { image: url })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={!canSave}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
