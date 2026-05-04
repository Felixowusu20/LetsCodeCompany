"use client";

import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Web Development",
    desc: "Modern responsive websites and scalable web apps.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
  },
  {
    id: 2,
    title: "Mobile Apps",
    desc: "Cross-platform mobile apps with seamless UX.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop",
  },
  {
    id: 3,
    title: "UI / UX Design",
    desc: "Clean, modern, and user-focused interfaces.",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=800&fit=crop",
  },
  {
    id: 4,
    title: "AI Solutions",
    desc: "Automation, AI tools, and intelligent systems.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
  },
  {
    id: 5,
    title: "Cyber Security",
    desc: "Secure systems and data protection strategies.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop",
  },
  {
    id: 6,
    title: "Hosting & Deployment",
    desc: "Cloud infrastructure and scalable deployments.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop",
  },
];

export default function Services() {
  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-20" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          What We Do
        </p>

        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900">
          Our Services
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          We deliver modern digital solutions that help businesses grow and scale.
        </p>
      </div>

      {/* IMAGE GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="relative h-[320px] rounded-2xl overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay={service.id * 70}
          >
            {/* IMAGE */}
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* CONTENT */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-semibold mb-2">
                {service.title}
              </h3>

              <p className="text-sm text-white/80 mb-4">
                {service.desc}
              </p>

              <Link
                href="/contact"
                className="text-sm font-semibold text-blue-300 hover:text-blue-400 transition"
              >
                Learn More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA BLOCK */}
      <div className="mt-24 text-center bg-blue-50 rounded-2xl p-14" data-aos="fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Ready to get started?
        </p>

        <h3 className="mt-4 text-3xl font-bold text-gray-900">
          Let’s build something amazing together.
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Partner with LetsCode to design, build, and scale your next big idea.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Contact Us
        </Link>
      </div>
    </>
  );
}
