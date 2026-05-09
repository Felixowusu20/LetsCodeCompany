"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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

type Partner = { id: string; name: string; logo: string; website?: string | null };

async function loadPartners(): Promise<Partner[]> {
  const res = await fetch("/api/public/partners", { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Partner[];
}

export default function PartnerMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    let alive = true;
    void loadPartners().then((rows) => {
      if (alive) setPartners(rows);
    });
    return () => {
      alive = false;
    };
  }, []);

  const orbitOne = useMemo(() => partners.slice(0, 4), [partners]);
  const orbitTwo = useMemo(() => partners.slice(4), [partners]);

  return (
    <section className="relative overflow-hidden bg-white py-28 text-slate-900">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-sky-100/40 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Trusted by Modern Brands
          </p>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            Built With{" "}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Leading Companies
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600">
            LetsCode partners with startups and global companies to build modern digital products and scalable platforms.
          </p>
        </div>

        {/* ================= ORBIT SYSTEM ================= */}
        <div className="relative mt-24 flex items-center justify-center">

          {/* CENTER CORE (LetsCode) */}
          <div className="relative z-20 flex h-44 w-44 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] translate-y-1">

            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">LetsCode</div>
              <div className="text-xs text-slate-500">Partner Network</div>
            </div>

            <div className="absolute h-full w-full animate-ping rounded-full border border-blue-200/60" />
          </div>

          {/* ================= ORBIT 1 ================= */}
          <div className="absolute h-[440px] w-[440px] animate-spin-slow">
            {orbitOne.map((partner, i) => (
              <div
                key={partner.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * 92}deg) translate(195px) rotate(-${i * 92}deg)`
                }}
              >
                <a
                  href={partner.website ?? partnerLinks[partner.name] ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition duration-300 hover:scale-110 hover:border-blue-300"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={40}
                    height={40}
                    className="opacity-70 grayscale transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </a>
              </div>
            ))}
          </div>

          {/* ================= ORBIT 2 ================= */}
          <div className="absolute h-[310px] w-[310px] animate-spin-reverse-slow">
            {orbitTwo.map((partner, i) => (
              <div
                key={partner.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * 118}deg) translate(145px) rotate(-${i * 118}deg)`
                }}
              >
                <a
                  href={partner.website ?? partnerLinks[partner.name] ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition duration-300 hover:scale-110 hover:border-sky-300"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={34}
                    height={34}
                    className="opacity-70 grayscale transition group-hover:grayscale-0 group-hover:opacity-100"
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