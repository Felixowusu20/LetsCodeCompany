"use client";

import { useEffect, useMemo, useState } from "react";

export type HeroSlideInput = {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
};

const defaultSlides: HeroSlideInput[] = [
  {
    id: 1,
    title: "Welcome to LetsCode",
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

export default function Hero({ slides: propSlides }: { slides?: HeroSlideInput[] }) {
  const slides = useMemo(() => {
    if (propSlides && propSlides.length > 0) return propSlides;
    return defaultSlides;
  }, [propSlides]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="relative flex h-screen items-center overflow-hidden">
      {slides.map((s, index) => (
        <div
          key={String(s.id)}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-white lg:px-10">
        <div className="max-w-2xl drop-shadow-lg" data-aos="fade-up">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            {slide.title.split("LetsCode").map((part, index) =>
              index === 0 ? (
                part
              ) : (
                <span key={index} className="text-blue-400">
                  LetsCode{part}
                </span>
              ),
            )}
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-white/90 md:text-xl" data-aos="fade-up" data-aos-delay="120">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="180">
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-blue-500/50 active:scale-[0.97]"
            >
              {slide.cta}
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/40 px-8 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition hover:bg-white/30"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition hover:bg-white/30"
      >
        ›
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2" data-aos="fade-up" data-aos-delay="260">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
