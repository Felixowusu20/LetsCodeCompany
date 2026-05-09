"use client";

import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import ImageUpload from "../../../components/admin/ImageUpload";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  authorAvatar: string;
  comments: number;
};

type Draft = Omit<BlogPost, "id"> & { id?: string };

function emptyDraft(): Draft {
  return {
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    image: "",
    authorAvatar: "",
    comments: 0,
  };
}

export default function AdminBlogsPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const isEditing = editingId != null;
  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!draft.title.trim()) missing.push("title");
    if (!draft.excerpt.trim()) missing.push("excerpt");
    if (!draft.author.trim()) missing.push("author");
    return missing;
  }, [draft.author, draft.excerpt, draft.title]);
  const canSave = missingFields.length === 0;

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<BlogPost[]>("/blogs");
      setItems(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Could not load posts.");
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
    setAttemptedSubmit(false);
  }

  function startEdit(p: BlogPost) {
    setEditingId(p.id);
    setDraft({ ...p, id: p.id });
    setAttemptedSubmit(false);
  }

  async function onSave() {
    setAttemptedSubmit(true);
    if (isSaving) return;
    if (!canSave) {
      setLoadError("Please fill the required fields: title, excerpt, and author.");
      return;
    }
    const payload = {
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content.trim(),
      author: draft.author.trim(),
      date: draft.date.trim() || emptyDraft().date,
      image: draft.image.trim(),
      authorAvatar: draft.authorAvatar.trim(),
      comments: Number.isFinite(draft.comments) ? draft.comments : 0,
    };
    try {
      setIsSaving(true);
      if (editingId) {
        await adminFetch(`/blogs/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/blogs", { method: "POST", body: JSON.stringify(payload) });
      }
      await refresh();
      startCreate();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await adminFetch(`/blogs/${id}`, { method: "DELETE" });
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Blog posts</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create and manage blog content.</p>
            </div>
            <button
              type="button"
              onClick={startCreate}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              New post
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10">
            <div className="grid grid-cols-[1.4fr_1fr_auto] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <div>Title</div>
              <div>Author</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white dark:divide-white/5 dark:bg-slate-950/50">
              {items.map((p) => (
                <div key={p.id} className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900 dark:text-white">{p.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</div>
                  </div>
                  <div className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{p.author}</div>
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
                <div className="px-5 py-10 text-sm text-slate-600 dark:text-slate-300">No posts yet. Create one on the right.</div>
              )}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? "Edit post" : "Create post"}</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Title <span className="text-red-600">*</span>
              </span>
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-4 dark:bg-white/5 dark:text-white",
                  attemptedSubmit && missingFields.includes("title")
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-300 dark:focus:ring-red-400/20"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100 dark:border-white/10 dark:focus:border-blue-300 dark:focus:ring-blue-400/20",
                ].join(" ")}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Excerpt <span className="text-red-600">*</span>
              </span>
              <textarea
                value={draft.excerpt}
                onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                className={[
                  "mt-2 min-h-[90px] w-full resize-y rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-4 dark:bg-white/5 dark:text-white",
                  attemptedSubmit && missingFields.includes("excerpt")
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-300 dark:focus:ring-red-400/20"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100 dark:border-white/10 dark:focus:border-blue-300 dark:focus:ring-blue-400/20",
                ].join(" ")}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Content</span>
              <textarea
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                className="mt-2 min-h-[180px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Author <span className="text-red-600">*</span>
                </span>
                <input
                  value={draft.author}
                  onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
                  className={[
                    "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-4 dark:bg-white/5 dark:text-white",
                    attemptedSubmit && missingFields.includes("author")
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-300 dark:focus:ring-red-400/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100 dark:border-white/10 dark:focus:border-blue-300 dark:focus:ring-blue-400/20",
                  ].join(" ")}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Date</span>
                <input
                  value={draft.date}
                  onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Comment count</span>
              <input
                type="number"
                min={0}
                value={draft.comments}
                onChange={(e) => setDraft((d) => ({ ...d, comments: Number(e.target.value) || 0 }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
              />
            </label>
            <ImageUpload label="Cover image" value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} />
            <ImageUpload
              label="Author avatar"
              value={draft.authorAvatar}
              onChange={(url) => setDraft((d) => ({ ...d, authorAvatar: url }))}
            />

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void onSave()}
                disabled={isSaving}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving…" : "Save"}
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
