"use client";

import Image from "next/image";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { getVideoEmbedKind, parseYouTubeVideoId } from "@/lib/videoEmbed";

export type HeroSlideInput = {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  videoUrl?: string | null;
};

const defaultSlides: HeroSlideInput[] = [
  {
    id: 1,
    title: "Welcome to ZeoFex",
    subtitle:
      "We build modern, scalable web applications that drive your business forward.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
    cta: "Get Started",
  },
  {
    id: 2,
    title: "Innovative Solutions",
    subtitle:
      "Cutting-edge technology combined with creative design for exceptional results.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&h=900&fit=crop",
    cta: "Learn More",
  },
  {
    id: 3,
    title: "Your Success Matters",
    subtitle: "From concept to deployment, we make your vision a reality.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&h=900&fit=crop",
    cta: "Contact Us",
  },
];

const unsupportedFileVideoHosts = ["vimeo.com", "player.vimeo.com"];

function subscribePrefersReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getPrefersReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function normalizeFileVideoUrl(videoUrl?: string | null) {
  const trimmed = videoUrl?.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) return trimmed;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return null;

  const host = parsed.hostname.replace(/^www\./, "");
  if (unsupportedFileVideoHosts.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
    return null;
  }

  return parsed.toString();
}

function youtubeHeroEmbedSrc(videoId: string) {
  const q = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
    modestbranding: "1",
    rel: "0",
  });
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${q}`;
}

function HeroSlideBackdrop({
  image,
  videoUrl,
  active,
  priority,
}: {
  image: string;
  videoUrl?: string | null;
  active: boolean;
  priority: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const raw = videoUrl?.trim() ?? "";
  const embedKind = raw ? getVideoEmbedKind(raw) : null;
  const youtubeId = embedKind === "youtube" ? parseYouTubeVideoId(raw) : null;
  const fileVideoUrl = embedKind === "file" ? normalizeFileVideoUrl(videoUrl) : null;

  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !fileVideoUrl) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const v = videoRef.current;
      if (!v) return;
      if (mq.matches || !active) {
        v.pause();
      } else {
        void v.play().catch(() => {});
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [active, fileVideoUrl]);

  const showYoutubeEmbed =
    Boolean(youtubeId) && active && !prefersReducedMotion;

  return (
    <>
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="z-0 object-cover"
      />
      {showYoutubeEmbed && youtubeId ? (
        <div
          className="hero-bg-video pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          aria-hidden
        >
          <iframe
            key={youtubeId}
            title=""
            src={youtubeHeroEmbedSrc(youtubeId)}
            className="absolute left-1/2 top-1/2 h-full min-h-[56.25vw] w-[177.78vh] min-w-full max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : null}
      {fileVideoUrl ? (
        <video
          key={fileVideoUrl}
          ref={videoRef}
          src={fileVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={image}
          preload="metadata"
          className="hero-bg-video pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
    </>
  );
}

export default function Hero({ slides: propSlides }: { slides?: HeroSlideInput[] }) {
  const slides = useMemo(
    () => (propSlides && propSlides.length > 0 ? propSlides : defaultSlides),
    [propSlides],
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  // Autoplay, but only when the tab is visible. Wrapped in startTransition so
  // React can interrupt this update if a real user interaction shows up.
  useEffect(() => {
    if (slides.length <= 1) return;
    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      startTransition(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      });
    };
    const timer = window.setInterval(tick, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  // Stable handlers; transitions keep clicks responsive (the click commits
  // immediately, the heavy re-render is scheduled cooperatively).
  const goTo = useCallback(
    (index: number) => {
      startTransition(() => {
        setCurrentSlide(((index % slides.length) + slides.length) % slides.length);
      });
    },
    [slides.length],
  );
  const nextSlide = useCallback(() => {
    startTransition(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    });
  }, [slides.length]);
  const prevSlide = useCallback(() => {
    startTransition(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    });
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden sm:min-h-[calc(100svh-5.25rem)]">
      {slides.map((s, index) => {
        const active = index === currentSlide;
        return (
          <div
            key={String(s.id)}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0">
              <HeroSlideBackdrop
                image={s.image}
                videoUrl={s.videoUrl}
                active={active}
                priority={index === 0}
              />
            </div>
          </div>
        );
      })}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-white sm:px-6 lg:px-10">
        <div className="max-w-2xl drop-shadow-lg">
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight sm:mb-6 sm:text-4xl md:text-6xl">
            {slide.title.split("ZeoFex").map((part, index) =>
              index === 0 ? (
                part
              ) : (
                <span key={index} className="text-blue-400">
                  ZeoFex{part}
                </span>
              ),
            )}
          </h1>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/90 sm:mb-10 sm:text-lg md:text-xl">
            {slide.subtitle}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-transform duration-200 hover:-translate-y-[2px] focus:outline-none focus:ring-4 focus:ring-blue-200/30 active:scale-[0.98] sm:w-auto sm:px-8"
            >
              {slide.cta}
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-white/20 sm:w-auto sm:px-8"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 sm:left-4"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 sm:right-4"
      >
        ›
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-white/20 ${
              index === currentSlide ? "w-8 bg-white" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
