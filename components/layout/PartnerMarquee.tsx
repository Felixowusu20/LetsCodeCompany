"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PartnerApplicationModal from "../partners/PartnerApplicationModal";

const partnerLinks: Record<string, string> = {
  Spotify: "https://spotify.com",
  Airbnb: "https://airbnb.com",
  Canon: "https://canon.com",
  Notion: "https://notion.so",
  Shopify: "https://shopify.com",
  Slack: "https://slack.com",
  Figma: "https://figma.com",
  Paystack: "https://paystack.com",
};

type Partner = {
  id: string;
  name: string;
  logo: string;
  website?: string | null;
};

async function loadPartners(signal: AbortSignal): Promise<Partner[]> {
  const res = await fetch("/api/public/partners", {
    cache: "no-store",
    signal,
  });
  if (!res.ok) return [];
  return (await res.json()) as Partner[];
}

type IdleCallback = (cb: () => void) => number;

const requestIdle: IdleCallback =
  typeof window !== "undefined" &&
  typeof (window as unknown as { requestIdleCallback?: IdleCallback })
    .requestIdleCallback === "function"
    ? (cb) =>
        (
          window as unknown as { requestIdleCallback: IdleCallback }
        ).requestIdleCallback(cb)
    : (cb) => window.setTimeout(cb, 200) as unknown as number;

function PartnerCard({ partner }: { partner: Partner }) {
  const href = partner.website ?? partnerLinks[partner.name] ?? "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${partner.name}`}
      className="group relative flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 px-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/80 hover:bg-white hover:shadow-[0_18px_40px_-12px_rgba(37,99,235,0.25)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-blue-400/40 dark:hover:bg-white/[0.08] dark:hover:shadow-[0_18px_40px_-12px_rgba(96,165,250,0.35)] sm:h-24 sm:w-52"
    >
      <Image
        src={partner.logo}
        alt={partner.name}
        width={140}
        height={56}
        loading="lazy"
        className="h-9 w-auto max-w-[8.5rem] object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-10"
      />
    </a>
  );
}

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="relative h-20 w-44 shrink-0 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/70 dark:border-white/10 dark:bg-white/[0.04] sm:h-24 sm:w-52"
    />
  );
}

export default function PartnerMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  // Defer the fetch until the browser is idle. This section is decorative, so
  // there's no reason to compete with hydration / first-interaction work.
  useEffect(() => {
    const controller = new AbortController();
    const id = requestIdle(() => {
      void loadPartners(controller.signal)
        .then((rows) => {
          if (!controller.signal.aborted) {
            setPartners(rows);
            setLoaded(true);
          }
        })
        .catch(() => {
          /* aborted or failed — leave empty */
        });
    });
    return () => {
      controller.abort();
      if (typeof window !== "undefined") {
        window.clearTimeout(id);
      }
    };
  }, []);

  const hasPartners = partners.length > 0;

  // After we've finished loading, if the admin has zero partners we hide the
  // logo strip entirely (no fake/duplicated content). The header + CTA still
  // render as a partnership invitation.
  const logos: React.ReactNode | null =
    loaded && !hasPartners
      ? null
      : hasPartners
        ? (
            <div className="partner-marquee-mask">
              <div className="partner-marquee-track">
                {/* The list is duplicated in the DOM purely so the CSS keyframe
                    (translateX -50%) loops seamlessly. The visible content is
                    exactly the partners stored in the admin — nothing fake. */}
                {[...partners, ...partners].map((p, i) => (
                  <PartnerCard key={`${p.id}-${i}`} partner={p} />
                ))}
              </div>
            </div>
          )
        : (
            <div className="partner-marquee-mask">
              <div className="flex gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={`s-${i}`} />
                ))}
              </div>
            </div>
          );

  return (
    <>
      <PartnerSection logos={logos} onApply={() => setApplyOpen(true)} />
      {applyOpen ? (
        <PartnerApplicationModal onClose={() => setApplyOpen(false)} />
      ) : null}
    </>
  );
}

function PartnerSection({
  logos,
  onApply,
}: {
  logos: React.ReactNode | null;
  onApply: () => void;
}) {
  return (
    <section
      aria-label="Our partners"
      className="relative overflow-hidden border-t border-slate-200/80 bg-white py-24 text-slate-900 dark:border-white/5 dark:bg-slate-950 dark:text-slate-100 sm:py-28"
    >
      {/* Soft ambient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[480px] rounded-full bg-sky-100/30 blur-[120px] dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Trusted Partners
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powering teams at{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-sky-400">
              world-class companies
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            From fast-moving startups to global enterprises, ZeoFex partners
            with ambitious teams to design, build, and scale modern digital
            products.
          </p>
        </div>

        {/* Logo row (renders exactly the partners stored in the admin) */}
        {logos ? <div className="mt-14 sm:mt-16">{logos}</div> : null}

        {/* CTA strip */}
        <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-5 rounded-3xl border border-slate-200/80 bg-white/70 px-6 py-6 text-center backdrop-blur sm:flex-row sm:justify-between sm:px-10 sm:text-left dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              Want to join our partner network?
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Let&apos;s build the next chapter of your product together.
            </span>
          </div>

          <button
            type="button"
            onClick={onApply}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 sm:w-auto"
          >
            Become a partner
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="ml-2 h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M10.293 4.293a1 1 0 011.414 0l4.999 5a1 1 0 010 1.414l-4.999 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
