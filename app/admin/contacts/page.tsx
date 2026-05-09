"use client";

import { useCallback, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import { CONTACT_PROJECT_TYPE_LABELS, type ContactProjectTypeApi } from "../../../lib/contactShared";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: ContactProjectTypeApi;
  projectDetails?: string;
  message: string;
  createdAt: string;
  status: "new" | "in_progress" | "closed";
};

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<ContactSubmission[]>("/contacts");
      setItems(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Could not load submissions.");
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  async function onStatusChange(c: ContactSubmission, status: ContactSubmission["status"]) {
    try {
      await adminFetch(`/contacts/${c.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Update failed.");
    }
  }

  async function onDelete(id: string) {
    try {
      await adminFetch(`/contacts/${id}`, { method: "DELETE" });
      await refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Delete failed.");
    }
  }

  async function onExportCsv() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/contacts/export", { credentials: "include" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Export failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contact-submissions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <AdminShell>
      {loadError ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {loadError}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact submissions</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Inbound messages from the public contact form, stored in PostgreSQL.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void onExportCsv()}
          disabled={exporting}
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {exporting ? "Preparing…" : "Download CSV"}
        </button>
      </div>

      <div className="mt-5 overflow-x-auto overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[1.1fr_1fr_0.85fr_1fr_0.75fr_auto] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Interest</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-slate-100 bg-white dark:divide-white/5 dark:bg-slate-950/50">
            {items.map((c) => (
              <div key={c.id} className="grid grid-cols-[1.1fr_1fr_0.85fr_1fr_0.75fr_auto] items-start gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900 dark:text-white">{c.name}</div>
                  <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                    {c.company ? `${c.company} • ` : ""}
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  {c.projectDetails ? (
                    <div className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{c.projectDetails}</div>
                  ) : null}
                  <div className="mt-2 line-clamp-2 text-sm text-slate-700 dark:text-slate-200">{c.message}</div>
                </div>
                <div className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{c.email}</div>
                <div className="truncate text-sm text-slate-700 dark:text-slate-200">{c.phone}</div>
                <div className="text-sm text-slate-700 dark:text-slate-200">
                  {CONTACT_PROJECT_TYPE_LABELS[c.projectType] ?? c.projectType}
                </div>
                <div>
                  <select
                    value={c.status}
                    onChange={(e) => void onStatusChange(c, e.target.value as ContactSubmission["status"])}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                  >
                    <option value="new">new</option>
                    <option value="in_progress">in progress</option>
                    <option value="closed">closed</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => void onDelete(c.id)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="px-5 py-10 text-sm text-slate-600 dark:text-slate-300">
                No submissions yet. When someone submits the contact form, they will show up here.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
