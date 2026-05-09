"use client";

import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import ImageUpload from "../../../components/admin/ImageUpload";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  websiteUrl?: string | null;
  downloadUrl?: string | null;
};

type Draft = {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  websiteUrl: string;
  downloadUrl: string;
};

function emptyDraft(): Draft {
  return { title: "", description: "", image: "", tags: "", websiteUrl: "", downloadUrl: "" };
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isEditing = editingId != null;
  const canSave = useMemo(
    () => draft.title.trim().length > 0 && draft.description.trim().length > 0,
    [draft.description, draft.title],
  );

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<Project[]>("/projects");
      setItems(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Could not load projects.");
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setDraft({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      tags: p.tags.join(", "),
      websiteUrl: p.websiteUrl ?? "",
      downloadUrl: p.downloadUrl ?? "",
    });
  }

  async function onSave() {
    if (!canSave) return;
    const tags = draft.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      image: draft.image.trim(),
      tags,
      websiteUrl: draft.websiteUrl.trim(),
      downloadUrl: draft.downloadUrl.trim(),
    };
    try {
      if (editingId) {
        await adminFetch(`/projects/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/projects", { method: "POST", body: JSON.stringify(payload) });
      }
      await refresh();
      startCreate();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save failed.");
    }
  }

  async function onDelete(id: string) {
    try {
      await adminFetch(`/projects/${id}`, { method: "DELETE" });
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

      <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Portfolio / case studies.</p>
            </div>
            <button
              type="button"
              onClick={startCreate}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              New project
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10">
            <div className="grid grid-cols-[1.4fr_1fr_auto] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <div>Title</div>
              <div>Tags</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white dark:divide-white/5 dark:bg-slate-950/50">
              {items.map((p) => (
                <div key={p.id} className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                    ) : null}
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900 dark:text-white">{p.title}</div>
                      <div className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{p.description}</div>
                    </div>
                  </div>
                  <div className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {p.tags.length ? p.tags.join(", ") : "—"}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(p.id)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="px-5 py-10 text-sm text-slate-600 dark:text-slate-300">No projects yet. Create one on the right.</div>
              )}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? "Edit project" : "Create project"}</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Title</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className="mt-2 min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
              />
            </label>
            <ImageUpload label="Cover image" value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} hint="Optional but recommended." />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Website URL</span>
                <input
                  value={draft.websiteUrl}
                  onChange={(e) => setDraft((d) => ({ ...d, websiteUrl: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                  placeholder="https://example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Download URL</span>
                <input
                  value={draft.downloadUrl}
                  onChange={(e) => setDraft((d) => ({ ...d, downloadUrl: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                  placeholder="https://downloads.example.com/app"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tags (comma-separated)</span>
              <input
                value={draft.tags}
                onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="Next.js, UI, Landing"
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
