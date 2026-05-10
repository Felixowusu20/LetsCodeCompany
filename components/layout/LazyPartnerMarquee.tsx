"use client";

import dynamic from "next/dynamic";

/**
 * Below-the-fold, animation-heavy section. We:
 *  - skip SSR (`ssr: false`) so the JS only loads after the page is interactive
 *  - render a height-reserved placeholder on the server so layout doesn't shift
 *
 * This shaves ~tens of KB and a chunk of hydration work off the initial route.
 */
const PartnerMarquee = dynamic(() => import("./PartnerMarquee"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[640px]" />,
});

export default function LazyPartnerMarquee() {
  return <PartnerMarquee />;
}
