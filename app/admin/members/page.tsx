"use client";

import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import ImageUpload from "../../../components/admin/ImageUpload";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type Member = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

type Draft = Omit<Member, "id"> & { id?: string };

function emptyDraft(): Draft {
  return { name: "", role: "", bio: "", image: "" };
}

export default function AdminMembersPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isEditing = editingId != null;

  const canSave = useMemo(() => {
    return draft.name.trim().length > 1 && draft.role.trim().length > 1;
  }, [draft.name, draft.role]);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<Member[]>("/members");
      setItems(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Could not load members.");
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function startEdit(m: Member) {
    setEditingId(m.id);
    setDraft({ id: m.id, name: m.name, role: m.role, bio: m.bio, image: m.image });
  }

  async function onSave() {
    if (!canSave) return;
    const payload = {
      name: draft.name.trim(),
      role: draft.role.trim(),
      bio: draft.bio.trim(),
      image: draft.image.trim(),
    };
    try {
      if (editingId) {
        await adminFetch(`/members/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/members", { method: "POST", body: JSON.stringify(payload) });
      }
      await refresh();
      startCreate();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save failed.");
    }
  }

  async function onDelete(id: string) {
    try {
      await adminFetch(`/members/${id}`, { method: "DELETE" });
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

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">All members</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add, edit, and remove team members. Photos are uploaded to your server.</p>
            </div>
            <button
              type="button"
              onClick={startCreate}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              New member
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10">
            <div className="grid grid-cols-[1.2fr_1fr_auto] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <div>Name</div>
              <div>Role</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white dark:divide-white/5 dark:bg-slate-950/50">
              {items.map((m) => (
                <div key={m.id} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                    ) : (
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 dark:bg-white/10" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900 dark:text-white">{m.name}</div>
                      {m.bio ? (
                        <div className="mt-0.5 line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{m.bio}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{m.role}</div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(m)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(m.id)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="px-5 py-10 text-sm text-slate-600 dark:text-slate-300">No members yet. Create one on the right.</div>
              )}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? "Edit member" : "Create member"}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {isEditing ? "Update the fields and save." : "Fill the form and save."}
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="Alice Johnson"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Role</span>
              <input
                value={draft.role}
                onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="CTO"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Bio</span>
              <textarea
                value={draft.bio}
                onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                className="mt-2 min-h-[110px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                placeholder="Short bio…"
              />
            </label>
            <ImageUpload label="Photo" value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} hint="Square or portrait crops work best." />

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
