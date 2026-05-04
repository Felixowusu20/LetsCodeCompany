"use client";

import { useState, useEffect } from "react";

const slides = [
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
    subtitle:
      "From concept to deployment, we make your vision a reality.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&h=900&fit=crop",
    cta: "Contact Us",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen flex items-center overflow-hidden">

      {/* ================= BACKGROUND ================= */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 🔥 IMPROVED OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
        </div>
      ))}

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 text-white">

        <div className="max-w-2xl drop-shadow-lg" data-aos="fade-up">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {slides[currentSlide].title.split("LetsCode").map((part, index) =>
              index === 0 ? (
                part
              ) : (
                <span key={index} className="text-blue-400">
                  LetsCode{part}
                </span>
              )
            )}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed" data-aos="fade-up" data-aos-delay="120">
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="180">

            {/* PRIMARY */}
            <button className="px-8 py-3 rounded-xl font-semibold text-white
                               bg-gradient-to-r from-blue-600 to-blue-700
                               shadow-lg shadow-blue-500/30
                               hover:shadow-blue-500/50
                               transition-all duration-300
                               hover:-translate-y-[2px] active:scale-[0.97]">
              {slides[currentSlide].cta}
            </button>

            {/* SECONDARY */}
            <button className="px-8 py-3 rounded-xl font-semibold
                               border border-white/40 text-white
                               backdrop-blur-md
                               hover:bg-white hover:text-black
                               transition-all duration-300">
              Learn More
            </button>

          </div>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2
                   bg-white/20 hover:bg-white/30
                   text-white p-3 rounded-full
                   backdrop-blur-md transition z-20"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2
                   bg-white/20 hover:bg-white/30
                   text-white p-3 rounded-full
                   backdrop-blur-md transition z-20"
      >
        ›
      </button>

      {/* ================= INDICATORS ================= */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20" data-aos="fade-up" data-aos-delay="260">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
