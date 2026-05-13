"use client";

import { Loader2, Send, X } from "lucide-react";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  COMPANY_SIZE_LABELS,
  PARTNERSHIP_TYPE_LABELS,
  PARTNER_TIMELINE_LABELS,
  type CompanySizeApi,
  type PartnerTimelineApi,
  type PartnershipTypeApi,
} from "../../lib/partnerApplicationShared";

const COMPANY_SIZE_OPTIONS: { value: CompanySizeApi; label: string }[] = [
  { value: "solo", label: COMPANY_SIZE_LABELS.solo },
  { value: "size_2_10", label: COMPANY_SIZE_LABELS.size_2_10 },
  { value: "size_11_50", label: COMPANY_SIZE_LABELS.size_11_50 },
  { value: "size_51_200", label: COMPANY_SIZE_LABELS.size_51_200 },
  { value: "size_201_1000", label: COMPANY_SIZE_LABELS.size_201_1000 },
  { value: "size_1000_plus", label: COMPANY_SIZE_LABELS.size_1000_plus },
];

const PARTNERSHIP_OPTIONS: { value: PartnershipTypeApi; label: string }[] = [
  { value: "technology", label: PARTNERSHIP_TYPE_LABELS.technology },
  { value: "reseller", label: PARTNERSHIP_TYPE_LABELS.reseller },
  { value: "agency", label: PARTNERSHIP_TYPE_LABELS.agency },
  { value: "referral", label: PARTNERSHIP_TYPE_LABELS.referral },
  { value: "affiliate", label: PARTNERSHIP_TYPE_LABELS.affiliate },
  { value: "strategic", label: PARTNERSHIP_TYPE_LABELS.strategic },
  { value: "other", label: PARTNERSHIP_TYPE_LABELS.other },
];

const TIMELINE_OPTIONS: { value: PartnerTimelineApi; label: string }[] = [
  { value: "immediately", label: PARTNER_TIMELINE_LABELS.immediately },
  { value: "within_30_days", label: PARTNER_TIMELINE_LABELS.within_30_days },
  { value: "within_90_days", label: PARTNER_TIMELINE_LABELS.within_90_days },
  { value: "exploring", label: PARTNER_TIMELINE_LABELS.exploring },
];

/**
 * The parent should conditionally render this component
 * (e.g. `{applyOpen ? <PartnerApplicationModal onClose={…} /> : null}`).
 * Mount/unmount cleanly resets the form on each open — no reset effect needed.
 */
export default function PartnerApplicationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll, close on Esc, focus the close button on mount.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      setError(null);
      setDone(false);
      setBusy(true);
    });

    const form = formRef.current ?? e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const payload = {
      companyName: get("companyName"),
      website: get("website") || undefined,
      industry: get("industry") || undefined,
      companySize: get("companySize"),
      headquarters: get("headquarters") || undefined,
      contactName: get("contactName"),
      contactRole: get("contactRole") || undefined,
      contactEmail: get("contactEmail"),
      contactPhone: get("contactPhone") || undefined,
      partnershipType: get("partnershipType"),
      goals: get("goals"),
      audienceFit: get("audienceFit") || undefined,
      expertise: get("expertise") || undefined,
      timeline: get("timeline"),
      budgetRange: get("budgetRange") || undefined,
      referralSource: get("referralSource") || undefined,
    };

    try {
      if (
        !payload.companyName ||
        !payload.contactName ||
        !payload.contactEmail ||
        !payload.goals ||
        !payload.companySize ||
        !payload.partnershipType ||
        !payload.timeline
      ) {
        throw new Error(
          "Please fill in the required fields (marked with *).",
        );
      }

      const res = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Could not send your application.");
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-app-title"
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <button
        aria-label="Close partner application"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-black/40 sm:rounded-3xl dark:bg-slate-950">
        {/* Header */}
        <div className="relative border-b border-slate-200/80 px-6 py-5 dark:border-white/10 sm:px-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Partner with ZeoFex
          </p>
          <h2
            id="partner-app-title"
            className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl"
          >
            Tell us about your partnership idea
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Takes about 2 minutes. We&apos;ll review and get back to you
            personally — usually within 1–2 business days.
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:focus:ring-blue-400/20 sm:right-6 sm:top-5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {done ? (
            <SuccessState onClose={onClose} />
          ) : (
            <form
              ref={formRef}
              onSubmit={(e) => void onSubmit(e)}
              className="space-y-8"
            >
              {/* About your company */}
              <Section
                title="About your company"
                subtitle="So we know who we'd be partnering with."
              >
                <Grid>
                  <Input
                    name="companyName"
                    label="Company name"
                    required
                    placeholder="Acme Inc."
                  />
                  <Input
                    name="website"
                    label="Website"
                    type="url"
                    placeholder="https://acme.com"
                  />
                  <Input
                    name="industry"
                    label="Industry"
                    placeholder="Fintech, e-commerce, healthtech…"
                  />
                  <Select
                    name="companySize"
                    label="Company size"
                    required
                    options={COMPANY_SIZE_OPTIONS}
                    placeholder="Select size"
                  />
                  <Input
                    name="headquarters"
                    label="Headquarters"
                    placeholder="City, country"
                    full
                  />
                </Grid>
              </Section>

              {/* Primary contact */}
              <Section
                title="Primary contact"
                subtitle="The person we should reach out to."
              >
                <Grid>
                  <Input
                    name="contactName"
                    label="Full name"
                    required
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <Input
                    name="contactRole"
                    label="Role / title"
                    placeholder="Head of Partnerships"
                  />
                  <Input
                    name="contactEmail"
                    label="Work email"
                    type="email"
                    required
                    placeholder="jane@acme.com"
                    autoComplete="email"
                  />
                  <Input
                    name="contactPhone"
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                  />
                </Grid>
              </Section>

              {/* Partnership intent */}
              <Section
                title="About the partnership"
                subtitle="Help us understand the shape of what you have in mind."
              >
                <Grid>
                  <Select
                    name="partnershipType"
                    label="Partnership type"
                    required
                    options={PARTNERSHIP_OPTIONS}
                    placeholder="Choose a type"
                  />
                  <Select
                    name="timeline"
                    label="When would you like to start?"
                    required
                    options={TIMELINE_OPTIONS}
                    placeholder="Choose a timeline"
                  />
                </Grid>

                <Textarea
                  name="goals"
                  label="What do you hope to achieve together?"
                  required
                  rows={4}
                  placeholder="Outcomes you're aiming for, problems you'd like to solve, or scale you're trying to reach."
                />

                <Grid>
                  <Textarea
                    name="audienceFit"
                    label="Who do you serve?"
                    rows={3}
                    placeholder="Your customers, markets, or geographies."
                  />
                  <Textarea
                    name="expertise"
                    label="What do you bring to the table?"
                    rows={3}
                    placeholder="Products, services, distribution, expertise."
                  />
                </Grid>
              </Section>

              {/* A bit more */}
              <Section
                title="A bit more (optional)"
                subtitle="These help us route your request faster — totally fine to skip."
              >
                <Grid>
                  <Input
                    name="budgetRange"
                    label="Budget range"
                    placeholder="e.g. $25k–$100k / quarter"
                  />
                  <Input
                    name="referralSource"
                    label="How did you hear about us?"
                    placeholder="Friend, search, event…"
                  />
                </Grid>
              </Section>

              {error ? (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  By submitting, you agree to be contacted about your
                  partnership inquiry. Your data is stored securely.
                </p>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {busy ? "Sending…" : "Submit application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- presentation helpers ---------------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">{children}</div>
  );
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-slate-800 dark:text-slate-100"
    >
      {children}
      {required ? <span className="ml-1 text-blue-600">*</span> : null}
    </label>
  );
}

const inputCx =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-300 dark:focus:ring-blue-400/20";

function Input({
  name,
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
  full,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputCx}
      />
    </div>
  );
}

function Textarea({
  name,
  label,
  required,
  rows = 4,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="sm:col-span-2">
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={`${inputCx} resize-none`}
      />
    </div>
  );
}

function Select<T extends string>({
  name,
  label,
  required,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  options: { value: T; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className={`${inputCx} appearance-none bg-[length:1rem] bg-no-repeat pr-10`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundPosition: "right 0.85rem center",
        }}
      >
        <option value="" disabled>
          {placeholder ?? "Select an option"}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
        Application received
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
        Thanks for reaching out. Our partnerships team will review your
        application and follow up within 1–2 business days.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700"
      >
        Done
      </button>
    </div>
  );
}
