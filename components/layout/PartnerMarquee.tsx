"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function PartnerMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);

  // Defer the fetch until the browser is idle. The marquee is decorative, so
  // there's no reason to compete with hydration / first-interaction work.
  useEffect(() => {
    const controller = new AbortController();
    const id = requestIdle(() => {
      void loadPartners(controller.signal)
        .then((rows) => {
          if (!controller.signal.aborted) setPartners(rows);
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

  const orbitOne = partners.slice(0, 4);
  const orbitTwo = partners.slice(4);

  return (
    <section className="relative overflow-hidden bg-white py-28 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[120px] dark:bg-blue-500/20" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-sky-100/40 blur-[120px] dark:bg-sky-500/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Trusted by Modern Brands
          </p>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            Built With{" "}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-400">
              Leading Companies
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600 dark:text-slate-300">
            ZeoFex partners with startups and global companies to build modern
            digital products and scalable platforms.
          </p>
        </div>

        <div className="relative mt-24 flex items-center justify-center">
          <div className="relative z-20 flex h-44 w-44 translate-y-1 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] dark:border-white/15 dark:bg-slate-900 dark:shadow-black/40">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">ZeoFex</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Partner Network</div>
            </div>

            <div className="absolute h-full w-full animate-ping rounded-full border border-blue-200/60 dark:border-blue-500/40" />
          </div>

          <div className="absolute h-[440px] w-[440px] animate-spin-slow">
            {orbitOne.map((partner, i) => (
              <div
                key={partner.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * 92}deg) translate(195px) rotate(-${i * 92}deg)`,
                }}
              >
                <a
                  href={partner.website ?? partnerLinks[partner.name] ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:scale-110 hover:border-blue-300 dark:border-white/15 dark:bg-slate-800"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="opacity-70 grayscale transition-opacity duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </a>
              </div>
            ))}
          </div>

          <div className="absolute h-[310px] w-[310px] animate-spin-reverse-slow">
            {orbitTwo.map((partner, i) => (
              <div
                key={partner.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * 118}deg) translate(145px) rotate(-${i * 118}deg)`,
                }}
              >
                <a
                  href={partner.website ?? partnerLinks[partner.name] ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:scale-110 hover:border-sky-300 dark:border-white/15 dark:bg-slate-800"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={34}
                    height={34}
                    loading="lazy"
                    className="opacity-70 grayscale transition-opacity duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
