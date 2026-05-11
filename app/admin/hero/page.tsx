"use client";

import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import ImageUpload from "../../../components/admin/ImageUpload";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  videoUrl: string | null;
  cta: string;
  sortOrder: number;
};

type Draft = Omit<HeroSlide, "id" | "videoUrl"> & { id?: string; videoUrl: string };

function emptyDraft(): Draft {
  return { title: "", subtitle: "", image: "", videoUrl: "", cta: "Get Started", sortOrder: 0 };
}

export default function AdminHeroPage() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isEditing = editingId != null;

  const canSave = useMemo(() => {
    return draft.title.trim().length > 2 && draft.subtitle.trim().length > 5 && draft.image.trim().length > 0;
  }, [draft.image, draft.subtitle, draft.title]);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<HeroSlide[]>("/hero-slides");
      setItems(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Could not load slides.");
    }
  }, []);

  useDeferredEffect(() => {
    void refresh();
  }, [refresh]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function startEdit(s: HeroSlide) {
    setEditingId(s.id);
    setDraft({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      videoUrl: s.videoUrl ?? "",
      cta: s.cta,
      sortOrder: s.sortOrder,
    });
  }

  async function onSave() {
    if (!canSave) return;
    const payload = {
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      image: draft.image.trim(),
      videoUrl: (draft.videoUrl ?? "").trim() || null,
      cta: draft.cta.trim() || "Get Started",
      sortOrder: Number.isFinite(draft.sortOrder) ? draft.sortOrder : 0,
    };
    try {
      if (editingId) {
        await adminFetch(`/hero-slides/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/hero-slides", { method: "POST", body: JSON.stringify(payload) });
      }
      await refresh();
      startCreate();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save failed.");
    }
  }

  async function onDelete(id: string) {
    try {
      await adminFetch(`/hero-slides/${id}`, { method: "DELETE" });
      await refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Delete failed.");
    }
  }

  return (
    <AdminShell>
      {loadError ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {loadError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_440px]">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hero carousel slides</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">These slides power the homepage hero. Lower sort order appears first.</p>
            </div>
            <button
              type="button"
              onClick={startCreate}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              New slide
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10">
            <div className="grid grid-cols-[1.4fr_1fr_auto] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <div>Title</div>
              <div>CTA</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white dark:divide-white/5 dark:bg-slate-950/50">
              {items.map((s) => (
                <div key={s.id} className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                    ) : null}
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900 dark:text-white">{s.title}</div>
                      <div className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{s.subtitle}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span>Order: {s.sortOrder}</span>
                        {s.videoUrl ? (
                          <span className="rounded-md bg-blue-100 px-1.5 py-0.5 font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
                            Video
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.cta}</div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(s.id)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="px-5 py-10 text-sm text-slate-600 dark:text-slate-300">No slides yet. Create one on the right.</div>
              )}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? "Edit slide" : "Create slide"}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Use high-quality images (16:9 recommended).</p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Title</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="Welcome to ZeoFex"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Subtitle</span>
              <textarea
                value={draft.subtitle}
                onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
                className="mt-2 min-h-[110px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="Short supporting line…"
              />
            </label>
            <ImageUpload label="Background image" value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} />
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Background video URL (optional)
              </span>
              <input
                value={draft.videoUrl ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, videoUrl: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="https://www.youtube.com/watch?v=… or https://example.com/background.mp4"
                inputMode="url"
                autoComplete="off"
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                <strong className="font-medium text-slate-600 dark:text-slate-300">YouTube</strong> links (watch, embed, Shorts,{" "}
                <span className="whitespace-nowrap">youtu.be</span>) or direct{" "}
                <strong className="font-medium text-slate-600 dark:text-slate-300">.mp4</strong> /{" "}
                <strong className="font-medium text-slate-600 dark:text-slate-300">.webm</strong> file URLs work. The background
                image stays as fallback and shows when motion is reduced (embedded video does not autoplay then).
              </p>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">CTA label</span>
              <input
                value={draft.cta}
                onChange={(e) => setDraft((d) => ({ ...d, cta: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="Get Started"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sort order</span>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
              />
            </label>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void onSave()}
                disabled={!canSave}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Save
              </button>
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
