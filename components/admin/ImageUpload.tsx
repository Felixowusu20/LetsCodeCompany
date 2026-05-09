"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { adminUpload, AdminApiError } from "../../lib/adminClient";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  accept?: string;
};

export default function ImageUpload({ label, value, onChange, hint, accept = "image/jpeg,image/png,image/webp,image/gif" }: Props) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setErr(null);
      setBusy(true);
      try {
        const { url } = await adminUpload(file);
        onChange(url);
      } catch (e) {
        const msg = e instanceof AdminApiError ? e.body : "Upload failed.";
        setErr(msg);
      } finally {
        setBusy(false);
      }
    },
    [onChange],
  );

  return (
    <div className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void onFile(e.dataTransfer.files?.[0]);
          }}
          className="flex min-h-[120px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-blue-400/50 dark:hover:bg-blue-500/5"
        >
          {busy ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          ) : (
            <ImagePlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          )}
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {busy ? "Uploading…" : "Click or drop an image"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">JPEG, PNG, WebP or GIF · max 5MB</span>
          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </label>
        {value ? (
          <div className="relative h-[120px] w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5 sm:w-[160px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 rounded-xl bg-slate-900/80 p-1.5 text-white shadow-lg backdrop-blur transition hover:bg-slate-900"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
      {err ? (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-300" role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}
