"use client";

import { useCallback, useMemo, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import { AdminApiError, adminFetch } from "../../../lib/adminClient";
import {
  COMPANY_SIZE_LABELS,
  PARTNERSHIP_TYPE_LABELS,
  PARTNER_APPLICATION_STATUS_LABELS,
  PARTNER_TIMELINE_LABELS,
  type PartnerApplicationApi,
  type PartnerApplicationApiStatus,
} from "../../../lib/partnerApplicationShared";
import { useDeferredEffect } from "../../../lib/useDeferredEffect";

const STATUS_FILTERS: { value: "all" | PartnerApplicationApiStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_BADGE: Record<PartnerApplicationApiStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  in_review: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export default function AdminPartnerApplicationsPage() {
  const [items, setItems] = useState<PartnerApplicationApi[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["value"]>("all");

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<PartnerApplicationApi[]>(
        "/partner-applications",
      );
      setItems(data);
      setLoadError(null);
    } catch (e) {
      setLoadError(
        e instanceof AdminApiError ? e.body : "Could not load applications.",
      );
    }
  }, []);

  useDeferredEffect(() => void refresh(), [refresh]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter],
  );

  const counts = useMemo(() => {
    const c: Record<PartnerApplicationApiStatus, number> = {
      new: 0,
      in_review: 0,
      approved: 0,
      rejected: 0,
    };
    for (const i of items) c[i.status] += 1;
    return c;
  }, [items]);

  async function onStatusChange(id: string, status: PartnerApplicationApiStatus) {
    try {
      await adminFetch(`/partner-applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Update failed.");
    }
  }

  async function onSaveNotes(id: string, notes: string) {
    try {
      await adminFetch(`/partner-applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      });
      await refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Save notes failed.");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this application? This can't be undone.")) return;
    try {
      await adminFetch(`/partner-applications/${id}`, { method: "DELETE" });
      if (openId === id) setOpenId(null);
      await refresh();
    } catch (e) {
      setLoadError(e instanceof AdminApiError ? e.body : "Delete failed.");
    }
  }

  async function onExportCsv() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/partner-applications/export", {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Export failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "partner-applications.csv";
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Partner applications
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Submissions from the public &ldquo;Become a partner&rdquo; form on
            the partners section.
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

      {/* Stat pills */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["new", "in_review", "approved", "rejected"] as const).map((s) => (
          <div
            key={s}
            className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {PARTNER_APPLICATION_STATUS_LABELS[s]}
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {counts[s]}
            </div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-x-auto overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[1.2fr_1.1fr_1fr_0.9fr_0.85fr_auto] gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <div>Company</div>
            <div>Contact</div>
            <div>Partnership</div>
            <div>Timeline</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100 bg-white dark:divide-white/5 dark:bg-slate-950/50">
            {filtered.map((a) => {
              const open = openId === a.id;
              return (
                <div key={a.id}>
                  <div className="grid grid-cols-[1.2fr_1.1fr_1fr_0.9fr_0.85fr_auto] items-start gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900 dark:text-white">
                        {a.companyName}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {COMPANY_SIZE_LABELS[a.companySize]}
                        {a.headquarters ? ` • ${a.headquarters}` : ""}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-800 dark:text-slate-100">
                        {a.contactName}
                      </div>
                      {a.contactRole ? (
                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {a.contactRole}
                        </div>
                      ) : null}
                      <div className="mt-0.5 truncate text-sm text-blue-600 dark:text-blue-400">
                        <a href={`mailto:${a.contactEmail}`}>{a.contactEmail}</a>
                      </div>
                    </div>

                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      {PARTNERSHIP_TYPE_LABELS[a.partnershipType]}
                    </div>

                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      {PARTNER_TIMELINE_LABELS[a.timeline]}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_BADGE[a.status]}`}
                      >
                        {PARTNER_APPLICATION_STATUS_LABELS[a.status]}
                      </span>
                      <select
                        value={a.status}
                        onChange={(e) =>
                          void onStatusChange(
                            a.id,
                            e.target.value as PartnerApplicationApiStatus,
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
                      >
                        <option value="new">new</option>
                        <option value="in_review">in review</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : a.id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        {open ? "Hide" : "View"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(a.id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {open ? (
                    <ApplicationDetails
                      app={a}
                      onSaveNotes={(notes) => void onSaveNotes(a.id, notes)}
                    />
                  ) : null}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="px-5 py-10 text-sm text-slate-600 dark:text-slate-300">
                {items.length === 0
                  ? "No applications yet. When someone submits the Become-a-partner form, they will show up here."
                  : "No applications match this filter."}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function ApplicationDetails({
  app,
  onSaveNotes,
}: {
  app: PartnerApplicationApi;
  onSaveNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");
  const dirty = (notes ?? "") !== (app.notes ?? "");

  return (
    <div className="border-t border-slate-200/80 bg-slate-50/70 px-5 py-5 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4 text-sm">
          <Field label="Website" value={app.website} link />
          <Field label="Industry" value={app.industry} />
          <Field label="Phone" value={app.contactPhone} />
          <Field label="Budget range" value={app.budgetRange} />
          <Field label="Heard about us via" value={app.referralSource} />
        </div>
        <div className="space-y-4 text-sm">
          <Block label="Goals" value={app.goals} />
          <Block label="Audience / fit" value={app.audienceFit} />
          <Block label="Expertise" value={app.expertise} />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Internal notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add notes only your team will see…"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-400/20"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            disabled={!dirty}
            onClick={() => onSaveNotes(notes)}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save notes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  link,
}: {
  label: string;
  value?: string;
  link?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-sm text-slate-800 dark:text-slate-100">
        {value ? (
          link ? (
            <a
              href={value.startsWith("http") ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-slate-400 dark:text-slate-500">—</span>
        )}
      </div>
    </div>
  );
}

function Block({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
        {value ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
      </div>
    </div>
  );
}
