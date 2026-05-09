"use client";

import { Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";

import { CONTACT_PROJECT_TYPE_LABELS, type ContactProjectTypeApi } from "../../lib/contactShared";

const PROJECT_OPTIONS: { value: ContactProjectTypeApi; label: string }[] = [
  { value: "web_app", label: CONTACT_PROJECT_TYPE_LABELS.web_app },
  { value: "mobile_app", label: CONTACT_PROJECT_TYPE_LABELS.mobile_app },
  { value: "both", label: CONTACT_PROJECT_TYPE_LABELS.both },
  { value: "other_consulting", label: CONTACT_PROJECT_TYPE_LABELS.other_consulting },
];

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(false);
    setBusy(true);
    const form = formRef.current ?? e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const projectType = String(fd.get("projectType") ?? "").trim();
    const projectDetails = String(fd.get("projectDetails") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    try {
      if (!name || !email || !phone || !projectType || !message) {
        throw new Error("Please fill in name, email, phone, project interest, and message.");
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: company || undefined,
          projectType,
          projectDetails: projectDetails || undefined,
          message,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Could not send message.");
      }
      setDone(true);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={(e) => void onSubmit(e)} className="mt-10 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@company.com"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-slate-800">
            Company <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Company name"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="block text-sm font-semibold text-slate-800">
            Project / product interest
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select an option
            </option>
            {PROJECT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="projectDetails" className="block text-sm font-semibold text-slate-800">
            Tell us more <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            type="text"
            id="projectDetails"
            name="projectDetails"
            placeholder="Product name, audience, or constraints"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Goals, timeline, and the product experience you want to create."
          className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {done ? (
        <p className="text-sm font-medium text-emerald-600" role="status">
          Thanks — your message was received. We will get back to you soon.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-6 text-slate-500">Submissions are stored securely and appear in the admin panel under Contacts.</p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {busy ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
